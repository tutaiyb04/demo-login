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
    const rawErrors = await this.validateCsvData(records, departmentId, token);

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
      EmployeeDataFile: [uploadRes.file_id],
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

  // THÊM HÀM NÀY VÀO TRONG CLASS UserImportCsvService
  async processPreview(
    file: Express.Multer.File,
    departmentId: string,
    token: string,
  ) {
    // 1. Kiểm tra định dạng file
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

    // 3. Validate dữ liệu giống hệt quá trình Upload
    const rawErrors = await this.validateCsvData(records, departmentId, token);

    // 4. Nếu có lỗi, nhóm lại và quăng lỗi 400 (để Frontend bật popup Error)
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

    // 5. Nếu KHÔNG có lỗi, trả về 10 dòng đầu tiên để Frontend hiện popup Preview
    return {
      message: 'Preview thành công',
      data: records.slice(0, 10), // Cắt lấy 10 dòng đầu cho nhẹ
    };
  }

  async getImportDetail(importId: string, token: string) {
    const projectId = this.hxbConfig.projectId;
    const datastoreId = this.hxbConfig.importDatastoreId;

    try {
      // Dùng service đã có sẵn để lấy thông tin item từ Datastore
      const itemDetail = await this.hexabaseService.getItemDetail(
        projectId,
        datastoreId,
        importId,
        token,
      );

      // Cấu trúc Hexabase trả về thường nằm trong object "item"
      const item = itemDetail.item || itemDetail;

      return {
        importId: item.i_id || importId,
        fileName: item.EmployeeDataFileName,
        totalRecords: Number(item.TotalEmployee) || 0,
        status: item.StatusImport,
        previewData: [], // Mảng rỗng
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
          StatusImport: 'Failed',
          BatchCompleteDate: new Date().toISOString(),
          // Nếu muốn, bạn có thể tạo 1 file ErrorLog dạng text/csv chứa chi tiết lỗi rồi upload và gán ID vào trường ErrorLog ở đây
        },
        token,
      );

      throw new BadRequestException('Quá trình đăng ký hàng loạt gặp lỗi');
    }
  }
}
