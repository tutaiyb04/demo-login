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
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getInfo(@Request() req) {
    return await this.usersService.findOne(
      req.user.username,
      req.user.hxbToken,
    );
  }

  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const hxbToken = req.user.hxbToken;
    return this.usersService.findAll(
      hxbToken,
      Number(page) || 1,
      Number(perPage) || 10,
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const hxbToken = req.user.hxbToken;
    return this.usersService.findOne(id, hxbToken);
  }

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

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    const hxbToken = req.user.hxbToken;
    return this.usersService.update(id, updateUserDto, hxbToken);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const hxbToken = req.user.hxbToken;
    return this.usersService.remove(id, hxbToken);
  }
}
