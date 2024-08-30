import { PartialType } from '@nestjs/mapped-types';
import { CreateFinalVideoDto } from './create-final-video.dto';

export class UpdateFinalVideoDto extends PartialType(CreateFinalVideoDto) {}
