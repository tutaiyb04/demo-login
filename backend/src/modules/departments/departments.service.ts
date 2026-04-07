/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import hexabaseConfig from '@/config/hexabase.config';
import { Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class DepartmentsService {
  constructor(
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
    private readonly hexabaseService: HexabaseService,
  ) {}

  async findAll(token: string) {
    const projectId = this.hxbConfig.projectId;
    const departmentDatastoreId = this.hxbConfig.departmentDatastoreId;

    const res = await this.hexabaseService.searchItems(
      projectId,
      departmentDatastoreId,
      token,
    );

    return res.items.map((item) => ({
      DepartmentName: item.DepartmentName,
      DepartmentCode: item.DepartmentCode,
      CreatedAt: item.CreatedAt,
      UpdatedAt: item.UpdatedAt,
    }));
  }
}
