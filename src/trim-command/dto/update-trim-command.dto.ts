import { PartialType } from '@nestjs/mapped-types';
import { CreateTrimCommandDto } from './create-trim-command.dto';

export class UpdateTrimCommandDto extends PartialType(CreateTrimCommandDto) {}
