/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import type { ConfigType } from '@nestjs/config';
import hexabaseConfig from '@/config/hexabase.config';
import * as csv from 'csv-parse/sync';
import 'multer';

export interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

type CsvRow = Record<string, unknown>;

@Injectable()
export class UserImportCsvService {
  constructor(
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
    private readonly hexabaseService: HexabaseService,
  ) {}

  async validateCsvData(
    csvRows: CsvRow[],
    departmentId: string,
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

    const requiredFields = [
      '操作',
      'ユーザーID',
      '名前',
      '仮名名前',
      '苗字',
      '仮名苗字',
      'ユーザー分類',
      '部署コード',
      '権限ID',
      'メールアドレス',
      '利用開始日',
    ];
    const maxLength20 = ['ユーザーID', '部署コード', '役割コード', '権限ID'];
    const maxLength100 = ['名前', '仮名名前', '苗字', '仮名苗字'];

    const pushError = (rowIndex: number, field: string, message: string) => {
      errors.push({ rowIndex, field, message });
    };
    const hasItems = (result: unknown): boolean => {
      if (!result || typeof result !== 'object') return false;
      const items = (result as { items?: unknown }).items;
      return Array.isArray(items) && items.length > 0;
    };
    const getStringValue = (value: unknown): string => {
      if (typeof value === 'string') return value;
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }
      return '';
    };
    const departmentExistsCache = new Map<string, boolean>();
    const userExistsCache = new Map<string, boolean>();
    const roleExistsCache = new Map<string, boolean>();
    const existsInDb = async (
      value: string,
      cache: Map<string, boolean>,
    ): Promise<boolean> => {
      if (cache.has(value)) return cache.get(value) as boolean;
      const result = await this.hexabaseService.searchItems(
        '',
        '',
        '',
        1,
        1,
        [],
      );
      const exists = hasItems(result);
      cache.set(value, exists);
      return exists;
    };

    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i] as Record<string, unknown>;

      for (const field of requiredFields) {
        if (!row[field] || getStringValue(row[field]).trim() === '') {
          pushError(i, field, `${field} là trường bắt buộc`);
        }
      }

      if (
        row['メールアドレス'] &&
        !emailRegex.test(getStringValue(row['メールアドレス']))
      ) {
        pushError(i, 'メールアドレス', 'Email sai format');
      }

      if (
        row['利用開始日'] &&
        !dateRegex.test(getStringValue(row['利用開始日']))
      ) {
        pushError(i, '利用開始日', 'Ngày phải đúng định dạng YYYY/MM/DD');
      }

      for (const field of maxLength20) {
        if (row[field] && getStringValue(row[field]).length > 20) {
          pushError(i, field, `${field} vượt quá 20 ký tự`);
        }
      }

      for (const field of maxLength100) {
        if (row[field] && getStringValue(row[field]).length > 100) {
          pushError(i, field, `${field} vượt quá 100 ký tự`);
        }
      }

      if (row['部署コード'] && row['部署コード'] !== departmentId) {
        pushError(
          i,
          '部署コード',
          '部署コード không khớp departmentId đã chọn',
        );
      }

      if (row['部署コード']) {
        const departmentCode = getStringValue(row['部署コード']);
        const departmentExists = await existsInDb(
          departmentCode,
          departmentExistsCache,
        );
        if (!departmentExists) {
          pushError(i, '部署コード', 'Department not found trong DB');
        }
      }

      if (row['ユーザーID']) {
        const userId = getStringValue(row['ユーザーID']);
        const userExists = await existsInDb(userId, userExistsCache);
        if (!userExists) {
          pushError(i, 'ユーザーID', 'User not found trong DB');
        }
      }

      if (row['役割コード']) {
        const roleCode = getStringValue(row['役割コード']);
        const roleExists = await existsInDb(roleCode, roleExistsCache);
        if (!roleExists) {
          pushError(i, '役割コード', 'Role not found trong DB');
        }
      }
    }

    return errors;
  }

  async processUpload(
    file: Express.Multer.File,
    departmentId: string,
    token: string,
  ) {
    // 1. Kiểm tra định dạng file CSV
    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File gửi lên phải là định dạng CSV');
    }

    // 2. Parse nội dung CSV
    let records: any[];
    try {
      const content = file.buffer.toString('utf-8').replace(/^\ufeff/, '');
      records = csv.parse(content, { columns: true, skip_empty_lines: true });
    } catch (e) {
      throw new BadRequestException('Không thể đọc nội dung file CSV');
    }

    // 3. Gọi hàm validate hiện tại của bạn
    const rawErrors = await this.validateCsvData(records, departmentId);

    // 4. Nếu có lỗi, nhóm lại theo rowIndex để hiển thị popup
    if (rawErrors.length > 0) {
      const groupedErrors = rawErrors.reduce((acc: any, err) => {
        const existing = acc.find((i: any) => i.rowIndex === err.rowIndex + 2); // +2 vì tính cả header và index 0
        if (existing) {
          existing.message.push(err.message);
        } else {
          acc.push({ rowIndex: err.rowIndex + 2, message: [err.message] });
        }
        return acc;
      }, []);

      throw new BadRequestException({
        message: 'Validation Failed',
        errors: groupedErrors,
      });
    }

    // 5. Nếu OK -> Upload lên Hexabase và lưu vào bảng ImportEmployeeManagement
    const projectId = this.hxbConfig.projectId;
    const datastoreId = this.hxbConfig.importDatastoreId;

    const uploadRes = await this.hexabaseService.uploadFile(file, token);

    const payload = {
      EmployeeDataFile: uploadRes.file_id,
      EmployeeDataFileName: file.originalname,
      StatusImport: '待機中',
      UploadDate: new Date().toISOString(),
      TotalEmployee: records.length,
    };

    return await this.hexabaseService.createItem(
      projectId,
      datastoreId,
      payload,
      token,
    );
  }

  async getImportTemplate(): Promise<Buffer> {
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

    const exampleRow = [
      '新規', // 操作: 新規, 更新, 削除
      'USER_001',
      '太郎',
      'タロウ',
      '山田',
      'ヤマダ',
      '正社員',
      'DEPT_001',
      'ROLE_001',
      'AUTH_001',
      'test@example.com',
      '2024/04/01',
      'STF_001',
      '備考メモ',
    ];

    // Kết hợp header và row thành chuỗi CSV (cách nhau bởi dấu phẩy)
    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');

    // Thêm BOM (UTF-8) để Excel nhận diện đúng font tiếng Nhật
    return Buffer.from('\ufeff' + csvContent, 'utf-8');
  }
}
