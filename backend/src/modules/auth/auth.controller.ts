/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '@/common/decorators/public.decoratos';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    const hxbToken = req.user.hxbToken;
    await this.authService.logout(hxbToken);

    return { message: 'Đăng xuất thành công' };
  }

  @Get('info')
  @HttpCode(HttpStatus.OK)
  async getInfo(@Request() req) {
    // req.user chứa payload từ JWT (bao gồm username, sub, hxbToken)
    // được gắn vào bởi JwtStrategy sau khi verify token thành công
    return await this.authService.getInfo(req.user);
  }
}
