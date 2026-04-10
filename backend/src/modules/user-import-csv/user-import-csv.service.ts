/* eslint-disable @typescript-eslint/no-base-to-string */
import { Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import hexabaseConfig from '@/config/hexabase.config';
import type { ConfigType } from '@nestjs/config';

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
    selectedDeptCode: string, // Mã phòng ban chọn từ ô select
    token: string, // Cần token để gọi API
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

    // Nghiệp vụ 6.1: Các trường bắt buộc
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

    const getStringValue = (value: unknown): string => {
      return value !== null && value !== undefined ? String(value).trim() : '';
    };

    // Cache để tránh gọi API nhiều lần cho cùng một giá trị trong 1 file
    const cache = new Map<string, boolean>();

    const checkExists = async (
      datastoreId: string,
      fieldId: string,
      value: string,
    ): Promise<boolean> => {
      const cacheKey = `${datastoreId}:${fieldId}:${value}`;
      if (cache.has(cacheKey)) return cache.get(cacheKey)!;

      const result = await this.hexabaseService.searchItems(
        this.hxbConfig.projectId,
        datastoreId,
        token,
        1,
        1,
        [{ id: fieldId, search_value: [value], operator: '==' }],
      );

      const exists = result.total > 0;
      cache.set(cacheKey, exists);
      return exists;
    };

    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i];

      // 6.1: Check Required
      for (const field of requiredFields) {
        if (getStringValue(row[field]) === '') {
          errors.push({
            rowIndex: i,
            field,
            message: `${field} là trường bắt buộc`,
          });
        }
      }

      // 6.2: Email format
      const email = getStringValue(row['メールアドレス']);
      if (email !== '' && !emailRegex.test(email)) {
        errors.push({
          rowIndex: i,
          field: 'メールアドレス',
          message: 'メールアドレス sai định dạng email',
        });
      }

      // 6.3: Date format
      const startDate = getStringValue(row['利用開始日']);
      if (startDate !== '' && !dateRegex.test(startDate)) {
        errors.push({
          rowIndex: i,
          field: '利用開始日',
          message: '利用開始日 phải đúng định dạng YYYY/MM/DD',
        });
      }

      // 6.4: Max length 20
      for (const field of maxLength20) {
        if (getStringValue(row[field]).length > 20) {
          errors.push({
            rowIndex: i,
            field,
            message: `${field} tối đa 20 ký tự`,
          });
        }
      }

      // 6.5: Max length 100
      for (const field of maxLength100) {
        if (getStringValue(row[field]).length > 100) {
          errors.push({
            rowIndex: i,
            field,
            message: `${field} tối đa 100 ký tự`,
          });
        }
      }

      // 6.6: Khớp với 部署コード đã chọn
      const rowDeptCode = getStringValue(row['部署コード']);
      if (rowDeptCode !== '' && rowDeptCode !== selectedDeptCode) {
        errors.push({
          rowIndex: i,
          field: '部署コード',
          message: '部署コード không khớp với phòng ban đã chọn',
        });
      }

      // 6.6, 6.7, 6.8: Kiểm tra tồn tại trong DB (Bảng User)
      // Giả sử bảng User chứa các thông tin này để đối soát
      if (rowDeptCode !== '') {
        const exists = await checkExists(
          this.hxbConfig.userDatastoreId,
          'departmentCode',
          rowDeptCode,
        );
        if (!exists)
          errors.push({
            rowIndex: i,
            field: '部署コード',
            message: '部署コード không tồn tại trong bảng User',
          });
      }

      const userId = getStringValue(row['ユーザーID']);
      if (userId !== '') {
        const exists = await checkExists(
          this.hxbConfig.userDatastoreId,
          'userId',
          userId,
        );
        if (!exists)
          errors.push({
            rowIndex: i,
            field: 'ユーザーID',
            message: 'ユーザーID không tồn tại trong bảng User',
          });
      }

      const roleCode = getStringValue(row['役割コード']);
      if (roleCode !== '') {
        const exists = await checkExists(
          this.hxbConfig.userDatastoreId,
          'role',
          roleCode,
        );
        if (!exists)
          errors.push({
            rowIndex: i,
            field: '役割コード',
            message: '役割コード không tồn tại trong bảng User',
          });
      }
    }

    return errors;
  }
}
