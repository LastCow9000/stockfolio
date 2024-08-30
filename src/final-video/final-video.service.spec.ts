import { Test, TestingModule } from '@nestjs/testing';
import { FinalVideoService } from './final-video.service';

describe('FinalVideoService', () => {
  let service: FinalVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalVideoService],
    }).compile();

    service = module.get<FinalVideoService>(FinalVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
