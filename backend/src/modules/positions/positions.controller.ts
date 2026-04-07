/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post, Request } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post('search-by-departmentCode')
  findByDepartment(
    @Request() req,
    @Body('DepartmentCode') departmentCode: string,
  ) {
    const hxbToken = req.user.hxbToken;
    return this.positionsService.findByDepartment(departmentCode, hxbToken);
  }
}
