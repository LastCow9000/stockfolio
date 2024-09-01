import { Module } from '@nestjs/common';
import { FinalVideoController } from './final-video.controller';
import { FinalVideoService } from './final-video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalVideo } from './entities/final-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinalVideo])],
  controllers: [FinalVideoController],
  providers: [FinalVideoService],
})
export class FinalVideoModule {}
