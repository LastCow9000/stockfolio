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
  OriginalVideoListResponse,
  UploadVideoResponse,
} from 'src/common/types/response';

@Controller('api/v1/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async getAllOriginalVideos(
    @Query('user_id') userId: number,
  ): Promise<OriginalVideoListResponse> {
    return await this.videoService.getAllOriginalVideos(userId);
  }

  @Get('/final-videos')
  async getAllFinalVideos(@Query('user_id') userId: number) {}

  @Get('/:final_video_id/download')
  async getDownLoadLinkOfFinalVideo(@Param('final_video_id') id: number) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @Query('user_id') userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<UploadVideoResponse> {
    return await this.videoService.uploadVideo(userId, files);
  }

  @Post('/execute')
  async executeCommand(@Query('user_id') userId: number) {}
}
