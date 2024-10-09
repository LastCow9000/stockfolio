import { Test, TestingModule } from '@nestjs/testing';
import { FinalVideoController } from './final-video.controller';

describe('FinalVideoController', () => {
  let controller: FinalVideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalVideoController],
      providers: [],
    }).compile();

    controller = module.get<FinalVideoController>(FinalVideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
