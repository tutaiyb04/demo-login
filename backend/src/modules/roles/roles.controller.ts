/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RolesService } from './roles.service';
import { Controller, Get, Request } from '@nestjs/common';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(@Request() req) {
    const hxbToken = req.user.hxbToken;

    return this.rolesService.findAll(hxbToken);
  }
}
