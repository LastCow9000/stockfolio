import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PUBLIC_ORIGINAL_VIDEO_PATH } from 'src/common/constants/path';
import { COMMAND, VIDEO } from 'src/common/constants/status';
import { ConcatInformation } from 'src/concat-command/entities/concat-information.entity';
import { join } from 'path';
import { ConcatCommandType } from 'src/common/types/response';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ConcatInformation)
    private readonly concatInformationRepository: Repository<ConcatInformation>,
    @InjectRepository(TrimCommand)
    private readonly trimCommandRepository: Repository<TrimCommand>,
    @InjectQueue('videoProcessing') private videoProcessingQueue: Queue,
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
    const trimCommands = await this.trimCommandRepository.find({
      where: { video: { user: { id: userId } }, status: COMMAND.PENDING },
      relations: ['video'],
    });

    await this.videoProcessingQueue.add(
      'videoProcessing',
      { userId, trimCommands, concatCommands },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );

    return { success: true, message: '작업 명령이 요청되었습니다.' };
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
}
