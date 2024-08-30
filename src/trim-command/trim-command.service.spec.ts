import { Test, TestingModule } from '@nestjs/testing';
import { TrimCommandService } from './trim-command.service';

describe('TrimCommandService', () => {
  let service: TrimCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrimCommandService],
    }).compile();

    service = module.get<TrimCommandService>(TrimCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
