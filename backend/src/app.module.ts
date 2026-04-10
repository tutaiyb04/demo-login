/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { AppService } from './app.service';
import { HexabaseModule } from './modules/hexabase/hexabase.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UserImportCsvController } from './modules/user-import-csv/user-import-csv.controller';
import { UserImportCsvModule } from './modules/user-import-csv/user-import-csv.module';
import hexabaseConfig from './config/hexabase.config';
import { UserImportCsvService } from './modules/user-import-csv/user-import-csv.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [hexabaseConfig] }),
    UsersModule,
    AuthModule,
    HexabaseModule,
    DepartmentsModule,
    PositionsModule,
    RolesModule,
    UserImportCsvModule,
  ],
  controllers: [AppController, UserImportCsvController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    UserImportCsvService,
  ],
})
export class AppModule {}
