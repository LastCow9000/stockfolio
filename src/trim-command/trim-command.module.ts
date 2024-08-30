import { Module } from '@nestjs/common';
import { TrimCommandService } from './trim-command.service';
import { TrimCommandController } from './trim-command.controller';
import { TrimCommand } from './entities/trim-command.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TrimCommand])],
  controllers: [TrimCommandController],
  providers: [TrimCommandService],
})
export class TrimCommandModule {}
