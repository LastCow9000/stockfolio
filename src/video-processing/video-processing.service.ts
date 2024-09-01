import { Injectable } from '@nestjs/common';
import { promises } from 'fs';
import {
  FINAL_VIDEO_PATH,
  ROOT_PATH,
  TEMP_PATH,
} from 'src/common/constants/path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';
import { ConcatCommand } from 'src/concat-command/entities/concat-command.entity';
import { FinalVideo } from 'src/final-video/entities/final-video.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { COMMAND, FINAL_VIDEO } from 'src/common/constants/status';
import { ConcatCommandType, CommandInfo } from 'src/common/types/response';
import { getOutputInfo } from 'src/common/util';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class VideoProcessingService {
  constructor(
    @InjectRepository(TrimCommand)
    private readonly trimCommandRepository: Repository<TrimCommand>,
    @InjectRepository(ConcatCommand)
    private readonly concatCommandRepository: Repository<ConcatCommand>,
    @InjectRepository(FinalVideo)
    private readonly finalVideoRepository: Repository<FinalVideo>,
  ) {}

  async executeCommands(
    userId: number,
    trimCommands: TrimCommand[],
    concatCommands: ConcatCommandType[],
  ) {
    await promises.mkdir(FINAL_VIDEO_PATH, { recursive: true });

    this.processTrim(userId, trimCommands);
    this.processConcat(userId, concatCommands);
  }

  private async processTrim(userId: number, trimCommands: TrimCommand[]) {
    for (const trimCommand of trimCommands) {
      const { id, video, startTime, endTime } = trimCommand;
      const { outputPath, publicOutputPath } = getOutputInfo(
        'trim',
        video.filePath,
      );

      const newFinalVideo = this.finalVideoRepository.create({
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
          filePath: publicOutputPath,
        });
      } catch (err) {
        await this.trimCommandRepository.update(id, { status: COMMAND.FAIL });
        await this.finalVideoRepository.update(savedFinalVideo.id, {
          status: FINAL_VIDEO.FAIL,
        });
      }
    }

    if (trimCommands.length !== 0) {
      console.log('Trim commands are processed');
    }
  }

  private async processConcat(
    userId: number,
    concatCommands: ConcatCommandType[],
  ) {
    for (const concatCommand of concatCommands) {
      const { id, status, createdAt, commandInfos } = concatCommand;
      const { outputPath, publicOutputPath } = getOutputInfo(
        'concat',
        commandInfos[0].video.filePath,
      );

      const newFinalVideo = this.finalVideoRepository.create({
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
          filePath: publicOutputPath,
        });
      } catch (err) {
        await this.trimCommandRepository.update(id, { status: COMMAND.FAIL });
        await this.finalVideoRepository.update(savedFinalVideo.id, {
          status: FINAL_VIDEO.FAIL,
        });
      }
    }

    if (concatCommands.length !== 0) {
      console.log('Concat commands are processed');
    }
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
        .on('error', reject)
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
}
