import { Module } from '@nestjs/common';
import { VideoProcessingService } from './video-processing.service';
import { VideoProcessingConsumer } from './video-processing.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcatCommand } from 'src/concat-command/entities/concat-command.entity';
import { FinalVideo } from 'src/final-video/entities/final-video.entity';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrimCommand, ConcatCommand, FinalVideo])],
  providers: [VideoProcessingService, VideoProcessingConsumer],
})
export class VideoProcessingModule {}
