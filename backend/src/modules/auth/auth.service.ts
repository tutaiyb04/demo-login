/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';

@Injectable()
export class AuthService {
  constructor(private hexabaseService: HexabaseService) {}

  async login(username: string, password: string) {
    const token = await this.hexabaseService.login(username, password);

    const user = await this.hexabaseService.getUserInfo(token);

    return {
      access_token: token,
      user: user,
    };
  }
}
