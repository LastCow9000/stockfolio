import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('api/v1/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async getAllVideos(@Query('user_id') userId: number) {}

  @Get()
  async getAllFinalVideos(@Query('user_id') userId: number) {}

  @Get('/:final_video_id/download')
  async getDownLoadLinkOfFinalVideo(@Param('final_video_id') id: number) {}

  @Post()
  async upload(@Query('user_id') userId: number) {}

  @Post('/execute')
  async executeCommand(@Query('user_id') userId: number) {}
}
