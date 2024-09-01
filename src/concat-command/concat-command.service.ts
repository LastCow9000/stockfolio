import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcatCommand } from './entities/concat-command.entity';
import { DataSource, Repository } from 'typeorm';
import { ConcatInformation } from './entities/concat-information.entity';
import { Video } from 'src/video/entities/video.entity';
import { CreateConcatCommandDto } from './dto/create-concat-command.dto';
import { COMMAND } from 'src/common/constants/status';
import { ConcatCommandType } from 'src/common/types/response';

@Injectable()
export class ConcatCommandService {
  constructor(
    @InjectRepository(ConcatCommand)
    private readonly concatCommandRepository: Repository<ConcatCommand>,
    @InjectRepository(ConcatInformation)
    private readonly conConcatInformationRepository: Repository<ConcatInformation>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly dataSource: DataSource,
  ) {}

  async create({ videoIds }: CreateConcatCommandDto) {
    for (const videoId of videoIds) {
      const video = await this.videoRepository.findOne({
        where: { id: videoId },
      });
      if (!video) {
        throw new NotFoundException(
          `videoId: ${videoId}에 해당하는 동영상이 존재하지 않습니다.`,
        );
      }
    }

    return this.dataSource.manager.transaction(async (entityManager) => {
      const newConcatCommand = this.concatCommandRepository.create({
        status: COMMAND.PENDING,
      });
      const savedConcatCommand = await entityManager.save(newConcatCommand);

      for (let i = 0; i < videoIds.length; i++) {
        const video = await entityManager.findOne(Video, {
          where: { id: videoIds[i] },
        });
        const newConcatInformation = this.conConcatInformationRepository.create(
          {
            order: i + 1,
            video,
            concatCommand: savedConcatCommand,
          },
        );

        await entityManager.save(newConcatInformation);
      }

      return { success: true };
    });
  }

  async getAllCommand(userId: number) {
    const concatInformations = await this.conConcatInformationRepository.find({
      where: {
        video: {
          user: { id: userId },
        },
      },
      relations: ['concatCommand', 'video'],
    });

    const data = this.convertConcatCommand(concatInformations);

    return {
      success: true,
      data,
    };
  }

  convertConcatCommand(
    concatInformations: ConcatInformation[],
  ): ConcatCommandType[] {
    const result = [];

    const concatCommandIds = new Set(
      concatInformations.map((info) => info.concatCommand.id),
    );

    concatCommandIds.forEach((id) => {
      const concatCommandsById = concatInformations.filter(
        (info) => info.concatCommand.id === id,
      );
      const convertedConcatInfo = concatCommandsById.map((info) => ({
        order: info.order,
        video: {
          id: info.video.id,
          filePath: info.video.filePath,
        },
      }));

      const concatInfoById = concatInformations.find((info) => info.id === id);
      const { status, createdAt } = concatInfoById.concatCommand;

      const covertedConcatCommand = {
        id,
        status,
        createdAt,
        commandInfos: convertedConcatInfo,
      };

      result.push(covertedConcatCommand);
    });

    return result;
  }
}
