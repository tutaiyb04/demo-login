/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserImportCsvService } from './user-import-csv.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users/import')
export class UserImportCsvController {
  constructor(private readonly userImportCsvService: UserImportCsvService) {}

  // backend/src/modules/user-import-csv/user-import-csv.controller.ts

  @Get('list')
  async getAllImports(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const hxbToken = req.user?.hxbToken;
    if (!hxbToken) {
      throw new UnauthorizedException('Không tìm thấy token của Hexabase');
    }

    return await this.userImportCsvService.findAll(
      hxbToken,
      Number(page) || 1,
      Number(perPage) || 10,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('departmentCode') departmentCode: string,
    @Body('userItemId') userItemId: string,
    @Req() req: any,
  ) {
    const user = req.user;
    const hxbToken = user?.hxbToken;

    const uploadUserName = user?.username || 'Unknown User';

    if (!hxbToken) {
      throw new UnauthorizedException('Không tìm thấy token của Hexabase');
    }

    return await this.userImportCsvService.processUpload(
      file,
      departmentCode,
      userItemId,
      uploadUserName,
      hxbToken,
    );
  }

  // THÊM API PREVIEW VÀO ĐÂY
  @Post('preview')
  @UseInterceptors(FileInterceptor('file'))
  async preview(
    @UploadedFile() file: Express.Multer.File,
    @Body('departmentId') departmentId: string,
    @Req() req: any,
  ) {
    const hxbToken = req.user?.hxbToken;
    if (!hxbToken) {
      throw new UnauthorizedException('Không tìm thấy token của Hexabase');
    }

    // Gọi hàm xử lý Preview ở service
    return await this.userImportCsvService.processPreview(
      file,
      departmentId,
      hxbToken,
    );
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.userImportCsvService.getImportTemplate();

    const fileName = 'user_import_template.csv';

    // Thiết lập các Header cho phản hồi HTTP
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      'Content-Length': buffer.length,
    });

    // Gửi buffer về phía client
    return res.end(buffer);
  }

  @Get(':importId')
  async getImportDetail(@Param('importId') importId: string, @Req() req: any) {
    const hxbToken = req.user?.hxbToken;
    if (!hxbToken) {
      throw new UnauthorizedException('Không tìm thấy token của Hexabase');
    }

    return await this.userImportCsvService.getImportDetail(importId, hxbToken);
  }

  @Post('execute/:importId')
  async executeBatchImport(
    @Param('importId') importId: string,
    @Req() req: any,
  ) {
    const hxbToken = req.user?.hxbToken;
    if (!hxbToken) throw new UnauthorizedException('Không tìm thấy token');

    return await this.userImportCsvService.executeImportData(
      importId,
      hxbToken,
    );
  }
}
