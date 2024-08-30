import { Controller } from '@nestjs/common';
import { TrimCommandService } from './trim-command.service';

@Controller('trim-command')
export class TrimCommandController {
  constructor(private readonly trimCommandService: TrimCommandService) {}
}
