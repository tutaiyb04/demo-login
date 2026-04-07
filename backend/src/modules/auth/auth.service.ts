/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { HexabaseService } from '../hexabase/hexabase.service';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import hexabaseConfig from '@/config/hexabase.config';

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

  async getInfo(userPayload: any) {
    const { username, hxbToken } = userPayload;

    console.log(hxbToken);

    // 1. Tìm user trong Datastore để lấy itemId (i_id)
    const conditions = [
      {
        id: 'userCode',
        search_value: [username],
        exact_match: true,
      },
    ];

    const searchResult = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      hxbToken,
      1,
      1,
      conditions,
    );

    if (!searchResult.items || searchResult.items.length === 0) {
      console.log(
        `User ${username} hợp lệ nhưng chưa có bản ghi trong Datastore.`,
      );

      // Gọi lại getUserInfo để lấy thông tin cơ bản của Workspace User
      const basicInfo = await this.hexabaseService.getUserInfo(hxbToken);

      // Trả về object có cấu trúc tương đương nhưng các mã code sẽ để trống/mặc định
      return {
        ...basicInfo,
        departmentCode: 'N/A', // Hoặc giá trị mặc định
        positionCode: 'N/A',
        role: 'GUEST',
      };
    }

    const itemId = searchResult.items[0].i_id;

    const itemDetail = await this.hexabaseService.getItemDetail(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      itemId,
      hxbToken,
    );

    const data = itemDetail.item || itemDetail;
    return {
      username: data.userCode || username,
      email: data.email,
      departmentCode: data.departmentCode || 'N/A',
      positionCode: data.positionCode || 'N/A',
      roleCode: data.role || 'GUEST',
    };
  }
}
