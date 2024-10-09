import { Test, TestingModule } from '@nestjs/testing';
import { TrimCommandController } from './trim-command.controller';
import { TrimCommandService } from './trim-command.service';

describe('TrimCommandController', () => {
  let controller: TrimCommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrimCommandController],
      providers: [TrimCommandService],
    }).compile();

    controller = module.get<TrimCommandController>(TrimCommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
