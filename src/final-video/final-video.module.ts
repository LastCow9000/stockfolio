import { Module } from '@nestjs/common';
import { FinalVideoController } from './final-video.controller';
import { FinalVideoService } from './final-video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalVideo } from './entities/final-video.entity';
import { ConcatInformation } from 'src/concat-command/entities/concat-information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinalVideo, ConcatInformation])],
  controllers: [FinalVideoController],
  providers: [FinalVideoService],
})
export class FinalVideoModule {}
