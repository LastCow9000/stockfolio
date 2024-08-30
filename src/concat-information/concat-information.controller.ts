import { Controller } from '@nestjs/common';
import { ConcatInformationService } from './concat-information.service';

@Controller('concat-information')
export class ConcatInformationController {
  constructor(
    private readonly concatInformationService: ConcatInformationService,
  ) {}
}
