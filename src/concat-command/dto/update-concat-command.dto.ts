import { PartialType } from '@nestjs/mapped-types';
import { CreateConcatCommandDto } from './create-concat-command.dto';

export class UpdateConcatCommandDto extends PartialType(CreateConcatCommandDto) {}
