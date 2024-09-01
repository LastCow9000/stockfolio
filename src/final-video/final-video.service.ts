import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalVideo } from './entities/final-video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FinalVideoService {
  constructor(
    @InjectRepository(FinalVideo)
    private readonly finalVideoRepository: Repository<FinalVideo>,
  ) {}

  async findFinalVideoById(id: number) {
    const finalVideo = await this.finalVideoRepository.findOne({
      where: { id },
    });
    if (!finalVideo) {
      throw new NotFoundException(
        `finalVideoId: ${id}에 해당하는 동영상이 존재하지 않습니다.`,
      );
    }

    return finalVideo;
  }
}
