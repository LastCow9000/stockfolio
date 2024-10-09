import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinalVideo } from './entities/final-video.entity';
import { Repository } from 'typeorm';
import { ConcatInformation } from 'src/concat-command/entities/concat-information.entity';

@Injectable()
export class FinalVideoService {
  constructor(
    @InjectRepository(FinalVideo)
    private readonly finalVideoRepository: Repository<FinalVideo>,
    @InjectRepository(ConcatInformation)
    private readonly concatInformationRepository: Repository<ConcatInformation>,
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

  async getAllFinalVideos(userId: number) {
    const finalVideos = await this.finalVideoRepository.find({
      where: { user: { id: userId } },
      relations: ['trimCommand', 'concatCommand'],
    });
    if (!finalVideos || !finalVideos.length) {
      throw new NotFoundException('생성된 최종 동영상이 없습니다.');
    }

    const data = finalVideos.map((finalVideo) => {
      if (!finalVideo.concatCommand) {
        delete finalVideo['concatCommand'];
        delete finalVideo['trimCommand'].createdAt;
        delete finalVideo['trimCommand'].status;
        return finalVideo;
      }

      if (!finalVideo.trimCommand) {
        delete finalVideo['trimCommand'];
        return finalVideo;
      }
    });

    for (const finalVideo of data) {
      if (finalVideo['concatCommand']) {
        finalVideo['concatCommandInfo'] = await this.convertConcatCommand(
          finalVideo['concatCommand'].id,
        );
        delete finalVideo['concatCommand'];
      }
    }

    return {
      success: true,
      data,
    };
  }

  private async convertConcatCommand(id: number) {
    const concatInfos = await this.concatInformationRepository.find({
      where: { concatCommand: { id } },
      relations: ['concatCommand', 'video'],
    });

    const paredConcatInfos = concatInfos.map((concatInfo) => ({
      id: concatInfo.video.id,
      order: concatInfo.order,
      filePath: concatInfo.video.filePath,
    }));

    return {
      id,
      originalVideos: paredConcatInfos,
    };
  }
}
