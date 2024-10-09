import { Test, TestingModule } from '@nestjs/testing';
import { ConcatCommandController } from './concat-command.controller';
import { ConcatCommandService } from './concat-command.service';

describe('ConcatCommandController', () => {
  let controller: ConcatCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcatCommandController],
      providers: [ConcatCommandService],
    }).compile();

    controller = module.get<ConcatCommandController>(ConcatCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
