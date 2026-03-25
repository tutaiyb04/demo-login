/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, pass: string) {
    const user = this.usersService.findByUser(username);

    if (!user) {
      throw new UnauthorizedException('Username không chính xác ');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.roleName,
    };

    return {
      message: 'Đăng nhập thành công',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.roleName,
      },
    };
  }
}
