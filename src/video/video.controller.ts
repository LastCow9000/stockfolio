import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ExecuteCommandResponse,
  OriginalVideoListResponse,
  UploadVideoResponse,
} from 'src/common/types/response';
import VideoFacade from './video.facade';

@Controller('api/v1/videos')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoFacade: VideoFacade,
  ) {}

  @Get()
  async getAllOriginalVideos(
    @Query('user_id') userId: number,
  ): Promise<OriginalVideoListResponse> {
    return await this.videoService.getAllOriginalVideos(userId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @Query('user_id') userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<UploadVideoResponse> {
    return await this.videoService.uploadVideo(userId, files);
  }

  @Post('/execute')
  async executeCommand(
    @Query('user_id') userId: number,
  ): Promise<ExecuteCommandResponse> {
    return this.videoFacade.executeCommands(userId);
  }
}
