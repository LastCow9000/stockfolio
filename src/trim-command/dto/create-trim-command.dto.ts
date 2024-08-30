import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrimCommandDto {
  @IsNumber()
  @IsNotEmpty()
  videoId: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}
