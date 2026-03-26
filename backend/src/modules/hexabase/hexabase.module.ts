import { Global, Module } from '@nestjs/common';
import { HexabaseService } from './hexabase.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [HexabaseService],
  exports: [HexabaseService],
})
export class HexabaseModule {}
