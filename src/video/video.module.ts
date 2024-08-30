import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { FinalVideo } from './entities/final-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, FinalVideo])],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
