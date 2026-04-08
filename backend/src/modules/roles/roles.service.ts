/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import hexabaseConfig from '@/config/hexabase.config';
import { HexabaseService } from './../hexabase/hexabase.service';
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
    // Role table was removed from Hexabase, so we infer available roles
    // from the user datastore itself (field `role`).
    const projectId = this.hxbConfig.projectId;
    const userDatastoreId = this.hxbConfig.userDatastoreId;

    const roleSet = new Set<string>();
    const perPage = 1000;
    let page = 1;

    while (true) {
      const res = await this.hexabaseService.searchItems(
        projectId,
        userDatastoreId,
        token,
        page,
        perPage,
      );

      for (const item of res.items || []) {
        const code = item.role || item.RoleLookUp || item.RoleCode || item.Role;
        if (typeof code === 'string' && code.trim()) roleSet.add(code);
      }

      const fetched = page * perPage;
      if (fetched >= res.total || res.items.length === 0) break;
      page += 1;
    }

    if (!roleSet.size) roleSet.add('GUEST');

    return Array.from(roleSet).map((code) => ({
      RoleName: code,
      RoleCode: code,
    }));
  }
}
