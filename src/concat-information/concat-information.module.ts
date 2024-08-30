import { Module } from '@nestjs/common';
import { ConcatInformationService } from './concat-information.service';
import { ConcatInformationController } from './concat-information.controller';
import { ConcatInformation } from './entities/concat-information.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConcatInformation])],
  controllers: [ConcatInformationController],
  providers: [ConcatInformationService],
})
export class ConcatInformationModule {}
