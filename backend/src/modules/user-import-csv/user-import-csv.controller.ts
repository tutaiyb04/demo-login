/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Res } from '@nestjs/common';

@Controller('users/import')
export class UserImportCsvController {
  @Get('template')
  downloadTemplate(@Res() res: Response) {
    // Định nghĩa các header theo yêu cầu của bạn
    const headers = [
      '操作',
      'ユーザーID',
      '名前',
      '仮名名前',
      '苗字',
      '仮名苗字',
      'ユーザー分類',
      '部署コード',
      '役割コード',
      '権限ID',
      'メールアドレス',
      '利用開始日',
      'スタッフコード',
      '備考',
    ];

    const csvContent = headers.join(',') + '\n';

    // Thêm BOM để Excel (Windows) có thể đọc đúng tiếng Nhật (UTF-8)
    const bom = Buffer.from('\uFEFF');
    const buffer = Buffer.concat([bom, Buffer.from(csvContent)]);

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="user_import_template.csv"',
      'Content-Length': buffer.length,
    });

    return res.status(200).send(buffer);
  }
}
