import { Test, TestingModule } from '@nestjs/testing';
import { ConcatCommandService } from './concat-command.service';

describe('ConcatCommandService', () => {
  let service: ConcatCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcatCommandService],
    }).compile();

    service = module.get<ConcatCommandService>(ConcatCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
