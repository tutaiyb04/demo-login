/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Request() req, @Body() createUserDto: CreateUserDto) {
    const hxbToken = req.user.hxbToken;
    return this.usersService.create(createUserDto, hxbToken);
  }

  @Post('password/change')
  changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const hxbToken = req.user.hxbToken;
    return this.usersService.changePassword(
      body.oldPassword,
      body.newPassword,
      hxbToken,
    );
  }

  @Post('password/forgot')
  forgotPassword(@Body() body: { email: string; userCode?: string }) {
    return this.usersService.forgotPassword(body.email, body.userCode);
  }

  @Get()
  findAll(@Request() req) {
    const hxbToken = req.user.hxbToken;
    return this.usersService.findAll(hxbToken);
  }

  @Get(':id')
  findOne() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
