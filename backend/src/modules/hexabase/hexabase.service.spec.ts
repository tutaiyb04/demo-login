/* eslint-disable @typescript-eslint/no-floating-promises */
import { Test, TestingModule } from '@nestjs/testing';
import { HexabaseService } from './hexabase.service';
import { beforeEach, describe, it } from 'node:test';

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
