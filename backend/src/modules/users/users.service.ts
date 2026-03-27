/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HexabaseService } from '../hexabase/hexabase.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private hexabaseService: HexabaseService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto, hxbToken: any) {
    const PROJECT_ID =
      this.configService.get<string>('HEXABASE_PROJECT_ID') || '';
    const DATASTORE_ID =
      this.configService.get<string>('HEXABASE_USER_DATASTORE_ID') || '';

    const WORKSPACE_ID =
      this.configService.get<string>('HEXABASE_WORKSPACE_ID') || '';
    const GROUP_ID = this.configService.get<string>('HEXABASE_GROUP_ID') || '';

    const adminInfo = await this.hexabaseService.getUserInfo(hxbToken);
    const invitorId = adminInfo.u_id || adminInfo.id;

    const fullName =
      `${createUserDto.lastName || ''} ${createUserDto.firstName || ''}`.trim();
    const password = createUserDto.password || 'Acf@Password2026';

    const workspaceUser = await this.hexabaseService.createWorkspaceUser(
      createUserDto.email,
      GROUP_ID,
      fullName,
      createUserDto.username,
      password,
      invitorId,
      hxbToken,
    );

    const datastorePayload = {
      userCode: createUserDto.username,
      lastName: createUserDto.lastName,
      firstName: createUserDto.firstName,
      lastNameKana: createUserDto.lastNameKana,
      firstNameKana: createUserDto.firstNameKana,
      departmentCode: createUserDto.departmentCode,
      positionCode: createUserDto.positionCode,
      email: createUserDto.email,
      startDate: createUserDto.startDate,
      staffCode: createUserDto.staffCode,
      remarks: createUserDto.remarks,
      role: createUserDto.roleCode,
      isApprover: String(createUserDto.isApprover) === 'true' ? ['true'] : [],
      canProxyApply:
        String(createUserDto.canProxyApply) === 'true' ? ['true'] : [],
      canProxyApprove:
        String(createUserDto.canProxyApprove) === 'true' ? ['true'] : [],
      workspaceUserId: workspaceUser.u_id || workspaceUser.id,
    };

    const result = await this.hexabaseService.createItem(
      PROJECT_ID,
      DATASTORE_ID,
      datastorePayload,
      hxbToken,
    );

    return {
      message: 'Tạo User thành công trên cả Workspace và Datastore',
      data: result,
    };
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    hxbToken: string,
  ) {
    return this.hexabaseService.changePassword(
      oldPassword,
      newPassword,
      hxbToken,
    );
  }
  async forgotPassword(email: string, userCode?: string) {
    return this.hexabaseService.forgotPasswordRequest(email, userCode);
  }

  async findAll(hxbToken: string) {
    const PROJECT_ID =
      this.configService.get<string>('HEXABASE_PROJECT_ID') || '';
    const DATASTORE_ID =
      this.configService.get<string>('HEXABASE_USER_DATASTORE_ID') || '';

    const rawItems = await this.hexabaseService.searchItems(
      PROJECT_ID,
      DATASTORE_ID,
      hxbToken,
    );

    console.log(
      '--- 3. DATA HEXABASE THỰC SỰ LƯU LÀ: ---',
      JSON.stringify(rawItems[0], null, 2),
    );

    const mappedUsers = rawItems.map((item: any) => {
      return {
        key: item.i_id,
        userCode: item.userCode || '',
        lastName: item.lastName || '',
        lastNameKana: item.lastNameKana || '',
        name: item.firstName || '',
        nameKana: item.firstNameKana || '',
        departmentCode: item.departmentCode || '',
        departmentName: item.departmentCode || '',
        roleCode: item.role || '',
        roleName: item.role || '',
        email: item.email || '',
        staffCode: item.staffCode || '',
        remarks: item.remarks || '',
        lastLogin: '',
      };
    });

    return mappedUsers;
  }

  findOne() {}

  findByEmail() {}

  findByUser() {}

  update() {}

  remove() {}
}
