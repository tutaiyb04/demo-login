/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import type { ConfigType } from '@nestjs/config';
import hexabaseConfig from '@/config/hexabase.config';

@Injectable()
export class DepartmentsService {
  constructor(
    private hexabaseService: HexabaseService,
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
  ) {}

  async getAllDepartments(hxbToken: string) {
    const response = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.departmentDatastoreId,
      hxbToken,
      1,
      1000,
    );

    return response.items
      .map((item: any) => ({
        departmentCode: item.DepartmentCode,
        departmentName: item.DepartmentName,

        createAt: item.CreatedAt,
        updatedAt: item.UpdatedAt,
      }))
      .filter((x: any) => x.departmentCode);
  }
}
