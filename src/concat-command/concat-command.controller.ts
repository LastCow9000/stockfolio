import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConcatCommandService } from './concat-command.service';
import { CreateConcatCommandDto } from './dto/create-concat-command.dto';
import { CreateConcatCommandResponse } from 'src/common/types/response';

@Controller('api/v1/concats')
export class ConcatCommandController {
  constructor(private readonly concatCommandService: ConcatCommandService) {}

  @Get()
  async getAllCommand(@Query('user_id') userId: number) {}

  @Post()
  async createCommand(
    @Body() dto: CreateConcatCommandDto,
  ): Promise<CreateConcatCommandResponse> {
    return await this.concatCommandService.create(dto);
  }
}
