import { Module } from '@nestjs/common';
import { ConcatCommandService } from './concat-command.service';
import { ConcatCommandController } from './concat-command.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcatCommand } from './entities/concat-command.entity';
import { ConcatInformation } from './entities/concat-information.entity';
import { Video } from 'src/video/entities/video.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcatCommand, ConcatInformation, Video]),
  ],
  controllers: [ConcatCommandController],
  providers: [ConcatCommandService],
  exports: [ConcatCommandService],
})
export class ConcatCommandModule {}
