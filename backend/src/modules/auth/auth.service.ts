/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private hexabaseService: HexabaseService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const hxbToken = await this.hexabaseService.login(username, password);

    const user = await this.hexabaseService.getUserInfo(hxbToken);

    const payload = {
      username: username,
      sub: user.id || user.u_id,
      hxbToken: hxbToken,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async logout(hxbToken: string) {
    return await this.hexabaseService.logout(hxbToken);
  }
}
