import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PUBLIC_ORIGINAL_VIDEO_PATH } from 'src/common/constants/path';
import { VIDEO } from 'src/common/constants/status';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
