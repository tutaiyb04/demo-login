/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import type { ConfigType } from '@nestjs/config';
import hexabaseConfig from '@/config/hexabase.config';

@Injectable()
export class PositionsService {
  constructor(
    private readonly hexabaseService: HexabaseService,
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
  ) {}

  async getByDepartmentCode(departmentCode: string, hxbToken: string) {
    if (!departmentCode) return [];

    const res = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.positionDatastoreId,
      hxbToken,
      1,
      1000,
    );

    return res.items
      .map((item: any) => ({
        departmentCode: item.DepartmentCode,
        positionCode: item.PositionCode,
        positionName: item.PositionName,
      }))
      .filter((item: any) => item.departmentCode === departmentCode)
      .map((item: any) => ({
        positionCode: item.positionCode,
        positionName: item.positionName,
      }));
  }
}
