/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
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

  private parseCsvBuffer(buffer: Buffer): any[] {
    try {
      let content = buffer.toString('utf-8');

      if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1);
      }
      content = content.replace(/^\ufeff/, '');

      const records = csv.parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      return records.map((row: any) => {
        const cleanRow: any = {};
        for (const key in row) {
          // Xóa sạch Zero-width space và BOM
          const cleanKey = key.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
          cleanRow[cleanKey] = row[key];
        }
        return cleanRow;
      });
    } catch (error) {
      console.error('Lỗi Parse CSV:', error);
      throw new BadRequestException(
        'Không thể đọc nội dung file CSV. Vui lòng kiểm tra lại định dạng.',
      );
    }
  }

  /** Hexabase may return File fields as string, id[], or expanded objects with `filename`. */
  private resolveImportCsvDisplayName(item: Record<string, unknown>): string {
    const fromFields = [item.EmployeeDataFileName, item.EmployeeDataFile];
    for (const raw of fromFields) {
      if (typeof raw === 'string' && raw.trim()) return raw;
      const arr = Array.isArray(raw) ? raw : [];
      const first = arr[0] as Record<string, unknown> | string | undefined;
      if (typeof first === 'string' && first.trim()) return first;
      if (first && typeof first === 'object') {
        const fn = first.filename ?? first.name;
        if (typeof fn === 'string' && fn.trim()) return fn;
      }
    }
    return '';
  }

  async validateCsvData(
    csvRows: CsvRow[],
    departmentId: string,
    token: string,
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

    const projectId = this.hxbConfig.projectId;

    const deptDatastoreId = this.hxbConfig.departmentDatastoreId;
    const userDatastoreId = this.hxbConfig.userDatastoreId;

    const existsInDb = async (
      datastoreId: string,
      fieldId: string,
      value: string,
      cache: Map<string, boolean>,
    ): Promise<boolean> => {
      if (cache.has(value)) return cache.get(value) as boolean;
      try {
        // Build điều kiện tìm kiếm chính xác theo Hexabase
        const conditions = [
          {
            id: fieldId,
            search_value: [value],
            exact_match: true,
          },
        ];

        const result = await this.hexabaseService.searchItems(
          projectId,
          datastoreId,
          token, // <--- Đã truyền token vào đây để hết lỗi 401
          1,
          1,
          conditions,
        );
        const exists = hasItems(result);
        cache.set(value, exists);
        return exists;
      } catch (error) {
        console.error(`Lỗi tìm kiếm Hexabase Datastore ${datastoreId}:`, error);
        return false;
      }
    };

    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i] as Record<string, unknown>;

      for (const field of requiredFields) {
        if (!row[field] || getStringValue(row[field]).trim() === '') {
          pushError(i, field, `${field} は必須項目です`);
        }
      }

      if (
        row['メールアドレス'] &&
        !emailRegex.test(getStringValue(row['メールアドレス']))
      ) {
        pushError(i, 'メールアドレス', 'Email sai format');
      }

      if (
        row['メールアドレス'] &&
        !emailRegex.test(getStringValue(row['メールアドレス']))
      ) {
        pushError(
          i,
          'メールアドレス',
          'メールアドレスの形式が正しくありません',
        );
      }

      if (
        row['利用開始日'] &&
        !dateRegex.test(getStringValue(row['利用開始日']))
      ) {
        pushError(
          i,
          '利用開始日',
          '利用開始日は YYYY/MM/DD 形式で入力してください',
        );
      }

      for (const field of maxLength20) {
        if (row[field] && getStringValue(row[field]).length > 20) {
          pushError(i, field, `${field} は20文字以内で入力してください`);
        }
      }

      for (const field of maxLength100) {
        if (row[field] && getStringValue(row[field]).length > 100) {
          pushError(i, field, `${field} は100文字以内で入力してください`);
        }
      }

      if (row['部署コード'] && row['部署コード'] !== departmentId) {
        pushError(
          i,
          '部署コード',
          '該当部署コードと会社コードが一致しません。',
        );
      }

      if (row['部署コード']) {
        const departmentCode = getStringValue(row['部署コード']);
        const departmentExists = await existsInDb(
          deptDatastoreId,
          'DepartmentCode', // Thay 'DepartmentCode' bằng Field ID thật của cột mã phòng ban trên Hexabase
          departmentCode,
          departmentExistsCache,
        );
        if (!departmentExists) {
          pushError(
            i,
            '部署コード',
            `部署コード「${departmentCode}」はマスターデータに存在しません`,
          );
        }
      }

      if (row['ユーザーID']) {
        const userId = getStringValue(row['ユーザーID']);
        const userExists = await existsInDb(
          userDatastoreId,
          'userId', // Thay 'UserId' bằng Field ID thật của cột user id trên Hexabase
          userId,
          userExistsCache,
        );
        if (!userExists) {
          pushError(
            i,
            'ユーザーID',
            `ユーザーID「${userId}」は存在していません。`,
          );
        }
      }
    }

    return errors;
  }

  // backend/src/modules/user-import-csv/user-import-csv.service.ts

  async findAll(token: string, page: number = 1, perPage: number = 10) {
    const projectId = this.hxbConfig.projectId;
    const datastoreId = this.hxbConfig.importDatastoreId;

    // Gọi searchItems không kèm điều kiện để lấy toàn bộ
    const res = await this.hexabaseService.searchItems(
      projectId,
      datastoreId,
      token,
      page,
      perPage,
      [], // Không lọc, lấy tất cả
    );

    // Map dữ liệu Hexabase sang định dạng Frontend (ImportRecord)
    const items = (res.items || []).map((item: any) => {
      const rawStatus = item.StatusImport || item.status || 'N/A';
      console.log('rawStatus', rawStatus);
      return {
        id: item.i_id,
        fileName: item.EmployeeDataFileName || 'N/A',
        status: rawStatus,
        uploadTime: item.UploadDate ? item.UploadDate : '',
        uploaderName: item.UploadUser || 'Unknown',
        completionTime: item.BatchCompleteDate || '',
      };
    });

    return {
      items,
      total: res.total || 0,
    };
  }

  private async findLookupItemId(
    datastoreId: string,
    codeField: string,
    codeValue: string | undefined,
    hxbToken: string,
  ): Promise<string | null> {
    if (!codeValue) return null;
    try {
      const res = await this.hexabaseService.searchItems(
        this.hxbConfig.projectId,
        datastoreId,
        hxbToken,
        1,
        1,
        [{ id: codeField, search_value: [codeValue], exact_match: true }],
      );
      const item = res.items?.[0];
      return item ? item.i_id : null;
    } catch (error) {
      return null;
    }
  }

  async processUpload(
    file: Express.Multer.File,
    departmentCode: string,
    userItemId: string,
    uploadUserName: string,
    token: string,
  ) {
    // 1. Kiểm tra định dạng file CSV
    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File gửi lên phải là định dạng CSV');
    }

    // 2. Parse nội dung CSV
    let records: any[];
    try {
      records = this.parseCsvBuffer(file.buffer);
    } catch (e) {
      throw new BadRequestException('Không thể đọc nội dung file CSV');
    }

    const rawErrors = await this.validateCsvData(
      records,
      departmentCode,
      token,
    );

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

    const exactFileId = uploadRes?.file_id || uploadRes?.id || uploadRes;
    const fileIds = exactFileId ? [exactFileId] : [];

    const department_i_id = await this.findLookupItemId(
      this.hxbConfig.departmentDatastoreId,
      'DepartmentCode',
      departmentCode,
      token,
    );

    const payload = {
      EmployeeDataFile: fileIds,
      EmployeeDataFileName: file.originalname,
      StatusImport: this.hxbConfig.statusUploadedOptionId,
      DepartmentCode: departmentCode,
      UploadDate: new Date().toISOString(),
      TotalEmployee: records.length,
      UploadUser: uploadUserName,
      UserLookUp: userItemId || '',
      DepartmentLookUp: department_i_id || '',
    };

    console.log('--- KIỂM TRA PAYLOAD TRƯỚC KHI GỬI VÀO CREATE ITEM ---');
    console.log(JSON.stringify(payload, null, 2));

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

    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');

    return Buffer.from('\ufeff' + csvContent, 'utf-8');
  }

  async processPreview(
    file: Express.Multer.File,
    departmentId: string,
    token: string,
  ) {
    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File gửi lên phải là định dạng CSV');
    }

    let records: any[];
    try {
      records = this.parseCsvBuffer(file.buffer);
    } catch (e) {
      throw new BadRequestException('Không thể đọc nội dung file CSV');
    }

    const rawErrors = await this.validateCsvData(records, departmentId, token);

    if (rawErrors.length > 0) {
      const groupedErrors = rawErrors.reduce((acc: any, err) => {
        const existing = acc.find((i: any) => i.rowIndex === err.rowIndex + 2);
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

    return {
      message: 'Preview thành công',
      data: records,
    };
  }

  async getImportDetail(importId: string, token: string) {
    const projectId = this.hxbConfig.projectId;
    const datastoreId = this.hxbConfig.importDatastoreId;

    try {
      const res = await this.hexabaseService.searchItems(
        projectId,
        datastoreId,
        token,
        1,
        1,
        [{ id: 'i_id', search_value: [importId], exact_match: true }],
      );

      console.log('res', res);
      if (!res.items || res.items.length === 0) {
        throw new BadRequestException('Không tìm thấy bản ghi Import');
      }
      const item = res.items[0];

      // lấy File ID
      let fileId = '';
      const fileData = item.EmployeeDataFile;

      if (Array.isArray(fileData) && fileData.length > 0) {
        // Có lúc Hexabase trả về file_id, có lúc trả về id
        fileId = fileData[0].file_id || fileData[0].id || fileData[0];
      } else if (fileData && typeof fileData === 'object') {
        fileId = (fileData as any).file_id || (fileData as any).id;
      } else if (typeof fileData === 'string') {
        // Đề phòng trả về JSON String
        try {
          const parsed = JSON.parse(fileData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            fileId = parsed[0].file_id || parsed[0].id;
          } else {
            fileId = fileData;
          }
        } catch (e) {
          fileId = fileData;
        }
      }

      let previewData: any[] = [];
      if (fileId) {
        try {
          const fileBuffer = await this.hexabaseService.downloadFile(
            fileId,
            token,
          );
          previewData = this.parseCsvBuffer(fileBuffer);
          console.log('previewData', previewData);
        } catch (e: any) {
          console.error('Lỗi khi tải/đọc file CSV cho Preview:', e.message);
        }
      } else {
        console.warn('CẢNH BÁO: Không trích xuất được fileId từ bản ghi!');
      }

      return {
        importId: item.i_id || importId,
        fileName: this.resolveImportCsvDisplayName(item),
        totalRecords: previewData.length || Number(item.TotalEmployee) || 0,
        status: item.StatusImport,
        previewData: previewData,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Không thể lấy thông tin bản ghi Import');
    }
  }

  // Trong user-import-csv.service.ts (Thêm hàm mới)
  async executeImportData(importId: string, token: string) {
    const projectId = this.hxbConfig.projectId;
    const datastoreId = this.hxbConfig.importDatastoreId;

    // 1. Chuyển ngay trạng thái sang 'Processing' và lưu thời gian bắt đầu
    await this.hexabaseService.updateItem(
      projectId,
      datastoreId,
      importId,
      {
        StatusImport: 'Processing',
        BatchStartDate: new Date().toISOString(),
      },
      token,
    );

    try {
      // ==========================================
      // 2. THỰC HIỆN LOGIC ĐĂNG KÝ USER CỦA BẠN Ở ĐÂY
      // (Đọc file CSV, gọi vòng lặp tạo user trên Hexabase...)
      // ==========================================

      // Giả lập logic chạy thành công:
      // ...

      // 3. Nếu toàn bộ user được tạo thành công -> Chuyển thành 'Registered'
      await this.hexabaseService.updateItem(
        projectId,
        datastoreId,
        importId,
        {
          StatusImport: 'Registered',
          BatchCompleteDate: new Date().toISOString(),
        },
        token,
      );

      return { message: 'Đăng ký hàng loạt thành công!' };
    } catch (error) {
      // 4. Nếu có lỗi (VD: trùng email, DB lỗi) -> Chuyển thành 'Failed'
      console.error('Lỗi khi đăng ký batch:', error);

      await this.hexabaseService.updateItem(
        projectId,
        datastoreId,
        importId,
        {
          StatusImport: this.hxbConfig.statusFailedOptionId,
          BatchCompleteDate: new Date().toISOString(),
          // Nếu muốn, bạn có thể tạo 1 file ErrorLog dạng text/csv chứa chi tiết lỗi rồi upload và gán ID vào trường ErrorLog ở đây
        },
        token,
      );

      throw new BadRequestException('Quá trình đăng ký hàng loạt gặp lỗi');
    }
  }
}
