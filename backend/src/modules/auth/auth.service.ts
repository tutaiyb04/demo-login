/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import hexabaseConfig from '@/config/hexabase.config';

type AuthInfoResponse = {
  username: string;
  email: string | null;
  fullName: string | null;
  workspaceUserId: string | null;
  itemId: string | null;
  departmentCode: string | null;
  positionCode: string | null;
  roleCode: string | null;
  // optional “nice to have” (nếu bạn map được)
  departmentName?: string | null;
  positionName?: string | null;
  roleName?: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
    private hexabaseService: HexabaseService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const hxbToken = await this.hexabaseService.login(username, password);

    const user = await this.hexabaseService.getUserInfo(hxbToken);

    const payload = {
      username: username,
      sub: user.id || user.u_id,
      hxbToken: hxbToken,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async logout(hxbToken: string) {
    return await this.hexabaseService.logout(hxbToken);
  }

  private async searchUserDatastoreOne(
    hxbToken: string,
    fieldId: string,
    value: string,
  ) {
    const res = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      hxbToken,
      1,
      1,
      [
        {
          id: fieldId,
          search_value: [value],
          exact_match: true,
        },
      ],
    );

    return res.items?.[0] ?? null;
  }

  private async findUserItemInDatastore(
    hxbToken: string,
    opts: {
      workspaceUserId: string | null;
      userCode: string | null;
      email: string | null;
    },
  ) {
    if (opts.workspaceUserId) {
      try {
        const byWs = await this.searchUserDatastoreOne(
          hxbToken,
          'workspaceUserId',
          opts.workspaceUserId,
        );
        if (byWs) return byWs;
      } catch (e) {
        console.log('Can not get workspaceUserId', e);
      }
    }
    if (opts.userCode) {
      try {
        const byCode = await this.searchUserDatastoreOne(
          hxbToken,
          'userCode',
          opts.userCode,
        );
        if (byCode) return byCode;
      } catch (e) {
        console.log('Can not get userCode: ', e);
      }
    }

    return null;
  }

  private flattenItemDetail(detail: any): Record<string, any> {
    const flat: Record<string, any> = {};
    const arr = Array.isArray(detail?.field_values) ? detail.field_values : [];
    for (const f of arr) {
      const key = f?.field_name || f?.field_id;
      if (!key) continue;
      flat[key] = f?.value ?? null;
    }
    // fallback nếu API có trả item phẳng
    if (detail?.item && typeof detail.item === 'object') {
      Object.assign(flat, detail.item);
    }
    return flat;
  }

  private pickLookupCode(v: any): string | null {
    if (!v) return null;
    // trường hợp lookup trả về object có code field
    if (typeof v === 'object') {
      return (
        v.DepartmentCode ||
        v.PositionCode ||
        v.RoleCode ||
        v.code ||
        v.value ||
        v.display_id ||
        v.id ||
        null
      );
    }
    // trường hợp lookup trả về string id/display_id
    if (typeof v === 'string') return v;
    return null;
  }

  async getInfo(userPayload: any): Promise<AuthInfoResponse> {
    const { username, hxbToken } = userPayload;
    // 1) Always lấy workspace profile trước (không phụ thuộc datastore)
    const workspace = await this.hexabaseService.getUserInfo(hxbToken);
    const workspaceUserId =
      workspace?.u_id ?? workspace?.id ?? workspace?.user_id ?? null;
    const workspaceUserCode =
      workspace?.user_code ?? workspace?.userCode ?? username ?? null;
    const workspaceEmail = workspace?.email ?? null;
    // 2) Tìm record trong user datastore để lấy itemId
    const listItem = await this.findUserItemInDatastore(hxbToken, {
      workspaceUserId,
      userCode: workspaceUserCode,
      email: workspaceEmail,
    });
    // 3) Không có record datastore => vẫn trả profile workspace + codes null
    if (!listItem?.i_id) {
      return {
        username: workspaceUserCode ?? username ?? '',
        email: workspaceEmail,
        fullName: workspace?.username ?? workspace?.name ?? null,
        workspaceUserId,
        itemId: null,
        departmentCode: null,
        positionCode: null,
        roleCode: null,
      };
    }
    // 4) Có itemId => lấy detail item để lấy codes/fields
    const itemDetail = await this.hexabaseService.getItemDetail(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      listItem.i_id,
      hxbToken,
    );

    const data = this.flattenItemDetail(itemDetail);

    const dept =
      data.departmentCode ?? this.pickLookupCode(data.DepartmentLookUp) ?? null;

    const pos =
      data.positionCode ?? this.pickLookupCode(data.PositionLookUp) ?? null;

    const role =
      data.role ??
      data.roleCode ??
      this.pickLookupCode(data.RoleLookUp) ??
      null;

    return {
      username: data.userCode ?? workspaceUserCode ?? username ?? '',
      email: data.email ?? workspaceEmail,
      fullName:
        [data.lastName, data.firstName].filter(Boolean).join(' ').trim() ||
        workspace?.username ||
        workspace?.name ||
        null,
      workspaceUserId: data.workspaceUserId ?? workspaceUserId,
      itemId: listItem.i_id,
      departmentCode: dept,
      positionCode: pos,
      roleCode: role,
    };
  }
}
