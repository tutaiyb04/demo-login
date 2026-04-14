import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserImportCsvController } from './user-import-csv.controller';
import { UserImportCsvService } from './user-import-csv.service';

@Module({
  imports: [UsersModule],
  controllers: [UserImportCsvController],
  providers: [UserImportCsvService],
})
export class UserImportCsvModule {}
