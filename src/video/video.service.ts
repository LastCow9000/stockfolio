import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  FINAL_VIDEO_PATH,
  PUBLIC_FINAL_VIDEO_PATH,
  PUBLIC_ORIGINAL_VIDEO_PATH,
  ROOT_PATH,
  TEMP_PATH,
} from 'src/common/constants/path';
import { COMMAND, FINAL_VIDEO, VIDEO } from 'src/common/constants/status';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';
import { ConcatCommand } from 'src/concat-command/entities/concat-command.entity';
import { ConcatInformation } from 'src/concat-command/entities/concat-information.entity';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { promises } from 'fs';
import { join } from 'path';
import { CommandInfo, ConcatCommandType } from 'src/common/types/response';
import { FinalVideo } from 'src/final-video/entities/final-video.entity';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TrimCommand)
    private readonly trimCommandRepository: Repository<TrimCommand>,
    @InjectRepository(ConcatCommand)
    private readonly concatCommandRepository: Repository<ConcatCommand>,
    @InjectRepository(ConcatInformation)
    private readonly concatInformationRepository: Repository<ConcatInformation>,
    @InjectRepository(FinalVideo)
    private readonly finalVideoRepository: Repository<FinalVideo>,
  ) {}

  async uploadVideo(userId: number, files: Array<Express.Multer.File>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const savedVideos = [];

    for (const file of files) {
      const newVideo = this.videoRepository.create({
        user,
        filePath: `/${join(PUBLIC_ORIGINAL_VIDEO_PATH, file.filename)}`,
        status: VIDEO.UPLOADED,
      });

      const savedVideo = await this.videoRepository.save(newVideo);
      savedVideos.push(savedVideo);
    }

    return {
      success: true,
      data: savedVideos.map((video) => ({
        id: video.id,
        filePath: video.filePath,
      })),
    };
  }

  async getAllOriginalVideos(userId: number) {
    const videos = await this.videoRepository.find({
      where: { user: { id: userId } },
    });

    return {
      success: true,
      data: videos.map((video) => ({ id: video.id, filePath: video.filePath })),
    };
  }

  async excuteCommand(userId: number, concatCommands: ConcatCommandType[]) {
    await promises.mkdir(FINAL_VIDEO_PATH, { recursive: true });

    const trimCommands = await this.trimCommandRepository.find({
      where: { video: { user: { id: userId } }, status: COMMAND.PENDING },
      relations: ['video'],
    });

    const trimResults = await this.processTrim(userId, trimCommands);
    const concatResults = await this.processConcat(userId, concatCommands);

    return trimResults.concat(concatResults);
  }

  private async processTrim(userId: number, trimCommands: TrimCommand[]) {
    const result = [];

    for (const trimCommand of trimCommands) {
      const { id, video, startTime, endTime } = trimCommand;
      const { outputFileName, outputPath, publicOutputPath } =
        this.getOutputInfo('trim', video.filePath);

      const newFinalVideo = this.finalVideoRepository.create({
        filePath: publicOutputPath,
        trimCommand,
        status: FINAL_VIDEO.PROCCESSING,
        user: { id: userId },
      });
      const savedFinalVideo =
        await this.finalVideoRepository.save(newFinalVideo);

      try {
        await this.trimVideo(video.filePath, outputPath, startTime, endTime);
        await this.trimCommandRepository.update(id, { status: COMMAND.DONE });
        await this.finalVideoRepository.update(savedFinalVideo.id, {
          status: FINAL_VIDEO.DONE,
        });

        result.push({
          success: true,
          originVideoId: video.id,
          command: 'trim',
          commandId: id,
          filePath: join(PUBLIC_FINAL_VIDEO_PATH, outputFileName),
        });
      } catch (err) {
        result.push({
          success: false,
          originVideoId: video.id,
          command: 'trim',
          commandId: id,
          reason: err?.message || 'unknown error',
        });
      }
    }

    return result;
  }

  async getConcatInfosByUserId(userId: number) {
    return await this.concatInformationRepository.find({
      where: {
        video: {
          user: { id: userId },
        },
        concatCommand: {
          status: COMMAND.PENDING,
        },
      },
      relations: ['concatCommand', 'video'],
    });
  }

  private async processConcat(
    userId: number,
    concatCommands: ConcatCommandType[],
  ) {
    const result = [];

    for (const concatCommand of concatCommands) {
      const { id, status, createdAt, commandInfos } = concatCommand;
      const { outputFileName, outputPath, publicOutputPath } =
        this.getOutputInfo('concat', commandInfos[0].video.filePath);

      const newFinalVideo = this.finalVideoRepository.create({
        filePath: publicOutputPath,
        concatCommand: { id, status, createdAt },
        status: FINAL_VIDEO.PROCCESSING,
        user: { id: userId },
      });
      const savedFinalVideo =
        await this.finalVideoRepository.save(newFinalVideo);

      try {
        await this.concatVideo(commandInfos, outputPath);
        await this.concatCommandRepository.update(id, { status: COMMAND.DONE });
        await this.finalVideoRepository.update(savedFinalVideo.id, {
          status: FINAL_VIDEO.DONE,
        });

        result.push({
          success: true,
          command: 'concat',
          commandId: id,
          originVideoIds: commandInfos.map(({ video: { id } }) => id),
          filePath: join(PUBLIC_FINAL_VIDEO_PATH, outputFileName),
        });
      } catch (err) {
        result.push({
          success: false,
          command: 'concat',
          commandId: id,
          originVideoIds: commandInfos.map(({ video: { id } }) => id),
          reason: err?.message || 'unknown error',
        });
      }
    }

    return result;
  }

  private concatVideo(commandInfos: CommandInfo[], outputPath: string) {
    return new Promise((resolve, reject) => {
      const command = ffmpeg();

      commandInfos.sort((x, y) => (x.order < y.order ? -1 : 1));

      commandInfos.forEach(({ video }) =>
        command.input(join(ROOT_PATH, video.filePath)),
      );

      command
        .on('end', resolve)
        .on('error', (err) => reject(err))
        .mergeToFile(outputPath, TEMP_PATH);
    });
  }

  private trimVideo(
    vedioPath: string,
    outputPath: string,
    startTime: string,
    endTime: string,
  ) {
    return new Promise((resolve, reject) => {
      ffmpeg(join(ROOT_PATH, vedioPath))
        .setStartTime(startTime)
        .setDuration(this.getTimeDiff(startTime, endTime))
        .output(outputPath)
        .on('end', resolve)
        .on('error', (err) => reject(err))
        .run();
    });
  }

  private getTimeDiff(startTime: string, endTime: string) {
    const start = this.convertTimeToSeconds(startTime);
    const end = this.convertTimeToSeconds(endTime);
    return end - start;
  }

  private convertTimeToSeconds(time: string) {
    const [hour, minute, second] = time.split(':').map(Number);
    return hour * 3600 + minute * 60 + second;
  }

  private getOutputInfo(type: 'trim' | 'concat', filePath: string) {
    const outputFileName = `${type === 'trim' ? 'trimmed' : 'concated'}_${Date.now()}.${filePath.split('.').pop()}`;
    const outputPath = join(FINAL_VIDEO_PATH, outputFileName);
    const publicOutputPath = join(PUBLIC_FINAL_VIDEO_PATH, outputFileName);

    return { outputFileName, outputPath, publicOutputPath };
  }
}
