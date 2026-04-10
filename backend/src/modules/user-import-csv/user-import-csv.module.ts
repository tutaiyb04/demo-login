import { Module } from '@nestjs/common';
import { UserImportCsvController } from './user-import-csv.controller';
import { UserImportCsvService } from './user-import-csv.service';

@Module({
  controllers: [UserImportCsvController],
  providers: [UserImportCsvService],
})
export class UserImportCsvModule {}
