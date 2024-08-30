import { Controller } from '@nestjs/common';
import { ConcatCommandService } from './concat-command.service';

@Controller('concat-command')
export class ConcatCommandController {
  constructor(private readonly concatCommandService: ConcatCommandService) {}
}
