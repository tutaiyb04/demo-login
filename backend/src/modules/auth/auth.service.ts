/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private hexabaseService: HexabaseService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(username: string, password: string) {
    const hxbToken = await this.hexabaseService.login(username, password);
    console.log(hxbToken);

    const basicUser = await this.hexabaseService.getUserInfo(hxbToken);
    console.log('basicUser', basicUser);

    const fullUserDetail = await this.usersService.findOne(
      basicUser.username,
      hxbToken,
    );
    console.log('fullUserDetail', fullUserDetail);

    const payload = {
      username: username,
      sub: basicUser.id || basicUser.u_id,
      hxbToken: hxbToken,
    };

    const responseUser = {
      ...basicUser,
      ...fullUserDetail,
    };

    console.log('responseUser', responseUser);

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: responseUser,
    };
  }

  async logout(hxbToken: string) {
    return await this.hexabaseService.logout(hxbToken);
  }
}
