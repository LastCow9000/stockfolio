import { Test, TestingModule } from '@nestjs/testing';
import { ConcatInformationController } from './concat-information.controller';
import { ConcatInformationService } from './concat-information.service';

describe('ConcatInformationController', () => {
  let controller: ConcatInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcatInformationController],
      providers: [ConcatInformationService],
    }).compile();

    controller = module.get<ConcatInformationController>(ConcatInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
