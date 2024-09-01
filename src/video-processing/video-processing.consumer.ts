import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { VideoProcessingService } from './video-processing.service';
import { ConcatCommandType } from 'src/common/types/response';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';

@Processor('videoProcessing')
export class VideoProcessingConsumer {
  constructor(
    private readonly videoProcessingService: VideoProcessingService,
  ) {}

  @Process('videoProcessing')
  async handleVideoProcessing(
    job: Job<{
      userId: number;
      trimCommands: TrimCommand[];
      concatCommands: ConcatCommandType[];
    }>,
  ) {
    const { userId, trimCommands, concatCommands } = job.data;
    await this.videoProcessingService.executeCommands(
      userId,
      trimCommands,
      concatCommands,
    );
  }
}
