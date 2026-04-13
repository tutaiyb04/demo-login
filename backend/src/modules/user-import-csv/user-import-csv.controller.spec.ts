import { Test, TestingModule } from '@nestjs/testing';
import { UserImportCsvController } from './user-import-csv.controller';
import { UserImportCsvService } from './user-import-csv.service';

describe('UserImportCsvController', () => {
  let controller: UserImportCsvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserImportCsvController],
      providers: [
        {
          provide: UserImportCsvService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserImportCsvController>(UserImportCsvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
