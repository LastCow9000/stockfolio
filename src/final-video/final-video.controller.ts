import { Controller } from '@nestjs/common';
import { FinalVideoService } from './final-video.service';

@Controller('final-video')
export class FinalVideoController {
  constructor(private readonly finalVideoService: FinalVideoService) {}
}
