import { Test, TestingModule } from '@nestjs/testing';
import { ConcatInformationService } from './concat-information.service';

describe('ConcatInformationService', () => {
  let service: ConcatInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcatInformationService],
    }).compile();

    service = module.get<ConcatInformationService>(ConcatInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
