import { PartialType } from '@nestjs/mapped-types';
import { CreateConcatInformationDto } from './create-concat-information.dto';

export class UpdateConcatInformationDto extends PartialType(CreateConcatInformationDto) {}
