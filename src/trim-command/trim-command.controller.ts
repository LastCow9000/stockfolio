import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TrimCommandService } from './trim-command.service';
import { CreateTrimCommandDto } from './dto/create-trim-command.dto';

@Controller('api/v1/trims')
export class TrimCommandController {
  constructor(private readonly trimCommandService: TrimCommandService) {}

  @Get()
  async getAllCommand(@Query('user_id') userId: number) {}

  @Post()
  async createCommand(@Body() dto: CreateTrimCommandDto) {}
}
