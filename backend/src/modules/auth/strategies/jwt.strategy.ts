/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'BIMAT_CUA_DEMO',
    });
  }

  async validate(payload: any) {
    // Giá trị return ở đây sẽ được NestJS tự động nhét vào biến `request.user`
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
