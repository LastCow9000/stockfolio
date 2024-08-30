import { Module } from '@nestjs/common';
import { FinalVideoService } from './final-video.service';
import { FinalVideoController } from './final-video.controller';
import { FinalVideo } from './entities/final-video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FinalVideo])],
  controllers: [FinalVideoController],
  providers: [FinalVideoService],
})
export class FinalVideoModule {}
