/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HexabaseService } from './../hexabase/hexabase.service';
import hexabaseConfig from '@/config/hexabase.config';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class RolesService {
  constructor(
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
    private readonly hexabaseService: HexabaseService,
  ) {}

  async findAll(token: string) {
    // THAY THẾ BẰNG PROJECT_ID VÀ DATASTORE_ID THỰC TẾ CỦA BẠN
    const projectId = this.hxbConfig.projectId;
    const roleDatastoreId = this.hxbConfig.roleDatastoreId;

    const res = await this.hexabaseService.searchItems(
      projectId,
      roleDatastoreId,
      token,
    );

    // Format lại data trả về cho frontend
    return res.items.map((item) => ({
      RoleName: item.RoleName,
      RoleCode: item.RoleCode,
    }));
  }
}
