import { Module } from '@nestjs/common';
import { TrimCommandService } from './trim-command.service';
import { TrimCommandController } from './trim-command.controller';
import { TrimCommand } from './entities/trim-command.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/video/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrimCommand, Video])],
  controllers: [TrimCommandController],
  providers: [TrimCommandService],
})
export class TrimCommandModule {}
