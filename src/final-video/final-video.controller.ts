import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { FINAL_VIDEO_PATH } from 'src/common/constants/path';
import { FinalVideoService } from './final-video.service';
import {
  AllFinalVideoListResponse,
  DownloadLinkResponse,
} from 'src/common/types/response';

@Controller('api/v1/final-videos')
export class FinalVideoController {
  constructor(private readonly fianlVideoService: FinalVideoService) {}

  @Get()
  async getAllFinalVideos(
    @Query('user_id') userId: number,
  ): Promise<AllFinalVideoListResponse> {
    return await this.fianlVideoService.getAllFinalVideos(userId);
  }

  @Get('/:final_video_id/downloadlink')
  async getDownLoadLinkOfFinalVideo(
    @Param('final_video_id') id: number,
  ): Promise<DownloadLinkResponse> {
    const file = await this.fianlVideoService.findFinalVideoById(id);
    const downloadLink = `localhost:3000/api/v1/final-videos/${file.filePath.split('\\').pop()}`;

    return {
      success: true,
      downloadLink,
    };
  }

  @Get('/:final_video_name')
  download(@Param('final_video_name') fileName: string, @Res() res: Response) {
    const filePath = join(FINAL_VIDEO_PATH, fileName);

    if (existsSync(filePath)) {
      res.download(filePath, fileName);
    } else {
      throw new NotFoundException('해당 파일이 존재하지 않습니다.');
    }
  }
}
