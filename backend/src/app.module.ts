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
import hexabaseConfig from './config/hexabase.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [hexabaseConfig] }),
    UsersModule,
    AuthModule,
    HexabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
