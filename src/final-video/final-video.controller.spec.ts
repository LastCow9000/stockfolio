import { Test, TestingModule } from '@nestjs/testing';
import { FinalVideoController } from './final-video.controller';
import { FinalVideoService } from './final-video.service';

describe('FinalVideoController', () => {
  let controller: FinalVideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalVideoController],
      providers: [FinalVideoService],
    }).compile();

    controller = module.get<FinalVideoController>(FinalVideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
