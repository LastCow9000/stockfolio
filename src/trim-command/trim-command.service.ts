import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrimCommandDto } from './dto/create-trim-command.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrimCommand } from './entities/trim-command.entity';
import { Repository } from 'typeorm';
import { Video } from 'src/video/entities/video.entity';
import { COMMAND } from 'src/common/constants/status';

@Injectable()
export class TrimCommandService {
  constructor(
    @InjectRepository(TrimCommand)
    private readonly trimCommandRepository: Repository<TrimCommand>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async create({ videoId, startTime, endTime }: CreateTrimCommandDto) {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
    });
    if (!video) {
      throw new NotFoundException('해당 동영상이 존재하지 않습니다.');
    }

    const newTrimCommand = this.trimCommandRepository.create({
      video,
      status: COMMAND.PENDING,
      startTime,
      endTime,
    });

    await this.trimCommandRepository.save(newTrimCommand);
    return { success: true };
  }

  async getAllCommand(userId: number) {
    const commands = await this.trimCommandRepository.find({
      where: { video: { user: { id: userId } } },
      relations: ['video'],
    });

    if (commands.length === 0) {
      throw new NotFoundException('Trim 명령이 존재하지 않습니다');
    }

    return {
      success: true,
      data: commands.map((command) => ({
        ...command,
        video: {
          id: command.video.id,
          filePath: command.video.filePath,
        },
      })),
    };
  }
}
