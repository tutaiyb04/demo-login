/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller, Get, Request } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll(@Request() req) {
    // Lấy token từ request (giống như cách làm ở UsersController)
    const hxbToken = req.user.hxbToken;

    return this.departmentsService.findAll(hxbToken);
  }
}
