/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import type { ConfigType } from '@nestjs/config';
import hexabaseConfig from '@/config/hexabase.config';

@Injectable()
export class PositionsService {
  constructor(
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
    private readonly hexabaseService: HexabaseService,
  ) {}

  async findByDepartment(departmentCode: string, token: string) {
    // THAY THẾ BẰNG PROJECT_ID VÀ DATASTORE_ID THỰC TẾ CỦA BẠN
    const projectId = this.hxbConfig.projectId;
    const datastoreId = this.hxbConfig.positionDatastoreId;

    // Lấy toàn bộ Position
    const res = await this.hexabaseService.searchItems(
      projectId,
      datastoreId,
      token,
    );

    // Lọc ra các Position thuộc Department vừa chọn
    const filteredPositions = res.items.filter(
      (item: any) => item.DepartmentCode === departmentCode,
    );

    // Format lại data
    return filteredPositions.map((item: any) => ({
      PositionCode: item.PositionCode,
      PositionName: item.PositionName,
      CreatedAt: item.CreatedAt,
      UpdatedAt: item.UpdatedAt,
    }));
  }
}
