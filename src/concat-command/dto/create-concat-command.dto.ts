import { IsArray } from 'class-validator';

export class CreateConcatCommandDto {
  @IsArray()
  videoIds: number[];
}
