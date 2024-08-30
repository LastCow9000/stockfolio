import { Module } from '@nestjs/common';
import { ConcatCommandService } from './concat-command.service';
import { ConcatCommandController } from './concat-command.controller';
import { ConcatCommand } from './entities/concat-command.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConcatCommand])],
  controllers: [ConcatCommandController],
  providers: [ConcatCommandService],
})
export class ConcatCommandModule {}
