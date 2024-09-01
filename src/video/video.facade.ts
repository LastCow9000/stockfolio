import { Injectable } from '@nestjs/common';
import { VideoService } from './video.service';
import { ConcatCommandService } from 'src/concat-command/concat-command.service';

@Injectable()
export default class VideoFacade {
  constructor(
    private readonly videoService: VideoService,
    private readonly concatCommandService: ConcatCommandService,
  ) {}

  async executeCommands(userId: number) {
    const concatInfos = await this.videoService.getConcatInfosByUserId(userId);
    const concatCommands =
      this.concatCommandService.convertConcatCommand(concatInfos);
    return await this.videoService.excuteCommand(userId, concatCommands);
  }
}
