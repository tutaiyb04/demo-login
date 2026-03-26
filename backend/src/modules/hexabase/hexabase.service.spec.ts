import { Test, TestingModule } from '@nestjs/testing';
import { HexabaseService } from './hexabase.service';

describe('HexabaseService', () => {
  let service: HexabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HexabaseService],
    }).compile();

    service = module.get<HexabaseService>(HexabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
