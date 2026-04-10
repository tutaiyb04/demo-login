import { Test, TestingModule } from '@nestjs/testing';
import { UserImportCsvController } from './user-import-csv.controller';

describe('UserImportCsvController', () => {
  let controller: UserImportCsvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserImportCsvController],
    }).compile();

    controller = module.get<UserImportCsvController>(UserImportCsvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
