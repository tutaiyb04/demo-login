/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import * as UserImportCsvServiceModule from './user-import-csv.service';
import { HexabaseService } from '../hexabase/hexabase.service';

type CsvRow = {
  [key: string]: string;
};

type ValidationError = {
  rowIndex: number;
  field: string;
  message: string;
};

type UserImportCsvServiceContract = {
  validateCsvData: (
    csvRows: CsvRow[],
    departmentId: string,
  ) => Promise<ValidationError[]>;
};

const UserImportCsvService = (
  UserImportCsvServiceModule as {
    UserImportCsvService: new (
      hexabaseService: HexabaseService,
    ) => UserImportCsvServiceContract;
  }
).UserImportCsvService;

describe('UserImportCsvService', () => {
  let service: UserImportCsvServiceContract;
  let hexabaseService: { searchItems: jest.Mock };

  const departmentId = 'DEP001';

  const buildValidRow = (): CsvRow => ({
    ユーザーID: 'user-001',
    部署コード: 'DEP001',
    役割コード: 'ROLE001',
    権限ID: 'PERM001',
    名前: 'Taro',
    仮名名前: 'タロウ',
    苗字: 'Yamada',
    仮名苗字: 'ヤマダ',
    メールアドレス: 'taro.yamada@example.com',
    利用開始日: '2026/04/10',
    スタッフコード: '',
    備考: '',
  });

  beforeEach(async () => {
    hexabaseService = {
      searchItems: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserImportCsvService,
        {
          provide: HexabaseService,
          useValue: hexabaseService,
        },
      ],
    }).compile();

    service = module.get<UserImportCsvServiceContract>(UserImportCsvService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validateCsvData_tatCaDongHopLe_traVeDanhSachLoiRong', async () => {
    // Arrange
    const csvRows = [
      buildValidRow(),
      { ...buildValidRow(), ユーザーID: 'user-002' },
    ];
    hexabaseService.searchItems.mockResolvedValue({
      items: [{ i_id: 'exists' }],
      total: 1,
    });

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual([]);
    expect(hexabaseService.searchItems).toHaveBeenCalled();
  });

  it('validateCsvData_thieuTruongBatBuoc_traVeLoi', async () => {
    // Arrange
    const invalidRow = buildValidRow();
    invalidRow.メールアドレス = '';
    const csvRows = [invalidRow];

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowIndex: 0,
          field: 'メールアドレス',
        }),
      ]),
    );
  });

  it('validateCsvData_saiDinhDangEmail_traVeLoi', async () => {
    // Arrange
    const invalidRow = buildValidRow();
    invalidRow.メールアドレス = 'invalid-email-format';
    const csvRows = [invalidRow];

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowIndex: 0,
          field: 'メールアドレス',
          message: expect.stringMatching(/email|format|形式/i),
        }),
      ]),
    );
  });

  it('validateCsvData_saiDinhDangNgayBatDau_traVeLoi', async () => {
    // Arrange
    const invalidRow = buildValidRow();
    invalidRow.利用開始日 = '2026-04-10';
    const csvRows = [invalidRow];

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowIndex: 0,
          field: '利用開始日',
          message: expect.stringMatching(/YYYY\/MM\/DD|format|形式/i),
        }),
      ]),
    );
  });

  it('validateCsvData_vuotQuaDoDaiToiDa_traVeLoi', async () => {
    // Arrange
    const invalidRow = buildValidRow();
    invalidRow.ユーザーID = 'x'.repeat(21);
    invalidRow.部署コード = 'y'.repeat(21);
    invalidRow.役割コード = 'z'.repeat(21);
    invalidRow.権限ID = 'p'.repeat(21);
    invalidRow.名前 = 'a'.repeat(101);
    invalidRow.仮名名前 = 'b'.repeat(101);
    invalidRow.苗字 = 'c'.repeat(101);
    invalidRow.仮名苗字 = 'd'.repeat(101);
    const csvRows = [invalidRow];

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rowIndex: 0, field: 'ユーザーID' }),
        expect.objectContaining({ rowIndex: 0, field: '部署コード' }),
        expect.objectContaining({ rowIndex: 0, field: '役割コード' }),
        expect.objectContaining({ rowIndex: 0, field: '権限ID' }),
        expect.objectContaining({ rowIndex: 0, field: '名前' }),
        expect.objectContaining({ rowIndex: 0, field: '仮名名前' }),
        expect.objectContaining({ rowIndex: 0, field: '苗字' }),
        expect.objectContaining({ rowIndex: 0, field: '仮名苗字' }),
      ]),
    );
  });

  it('validateCsvData_maPhongBanKhongKhopDepartmentId_traVeLoi', async () => {
    // Arrange
    const invalidRow = buildValidRow();
    invalidRow.部署コード = 'DEP999';
    const csvRows = [invalidRow];
    hexabaseService.searchItems.mockResolvedValue({
      items: [{ i_id: 'exists' }],
      total: 1,
    });

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowIndex: 0,
          field: '部署コード',
          message: expect.stringMatching(/departmentId|一致|match/i),
        }),
      ]),
    );
  });

  it('validateCsvData_khongTimThayMaPhongBanTrongDb_traVeLoi', async () => {
    // Arrange
    const csvRows = [buildValidRow()];
    hexabaseService.searchItems.mockResolvedValue({ items: [], total: 0 });

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowIndex: 0,
          field: '部署コード',
          message: expect.stringMatching(/not found|存在/i),
        }),
      ]),
    );
  });

  it('validateCsvData_khongTimThayUserIdTrongDb_traVeLoi', async () => {
    // Arrange
    const csvRows = [buildValidRow()];
    hexabaseService.searchItems
      .mockResolvedValueOnce({ items: [{ i_id: 'dep-exists' }], total: 1 })
      .mockResolvedValueOnce({ items: [], total: 0 });

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowIndex: 0,
          field: 'ユーザーID',
          message: expect.stringMatching(/not found|存在/i),
        }),
      ]),
    );
  });

  it('validateCsvData_khongTimThayRoleCodeTrongDb_traVeLoi', async () => {
    // Arrange
    const csvRows = [buildValidRow()];
    hexabaseService.searchItems
      .mockResolvedValueOnce({ items: [{ i_id: 'dep-exists' }], total: 1 })
      .mockResolvedValueOnce({ items: [{ i_id: 'user-exists' }], total: 1 })
      .mockResolvedValueOnce({ items: [], total: 0 });

    // Act
    const result = await service.validateCsvData(csvRows, departmentId);

    // Assert
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowIndex: 0,
          field: '役割コード',
          message: expect.stringMatching(/not found|存在/i),
        }),
      ]),
    );
  });

  it('validateCsvData_hexabaseBaoLoiKhiKiemTraUserId_nemLaiLoiDependency', async () => {
    // Arrange
    const csvRows = [buildValidRow()];
    hexabaseService.searchItems
      .mockResolvedValueOnce({ items: [{ i_id: 'dep-exists' }], total: 1 })
      .mockRejectedValueOnce(new Error('Hexabase DB unavailable'));

    // Act & Assert
    await expect(
      service.validateCsvData(csvRows, departmentId),
    ).rejects.toThrow('Hexabase DB unavailable');
  });
});
