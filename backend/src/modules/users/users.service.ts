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
    const workspaceUser = await this.hexabaseService.createWorkspaceUser(
      createUserDto,
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
      isApprover: createUserDto.isApprover,
      canProxyApply: createUserDto.canProxyApply,
      canProxyApprove: createUserDto.canProxyApprove,
      // Lưu lại ID của user trên workspace để sau này dễ truy xuất
      workspaceUserId: workspaceUser.id,
    };

    const PROJECT_ID =
      this.configService.get<string>('HEXABASE_PROJECT_ID') || '';
    const DATASTORE_ID =
      this.configService.get<string>('HEXABASE_USER_DATASTORE_ID') || '';

    const WORKSPACE_ID =
      this.configService.get<string>('HEXABASE_WORKSPACE_ID') || '';
    const GROUP_ID = this.configService.get<string>('HEXABASE_GROUP_ID') || '';

    await this.hexabaseService.addUserToWorkspace(
      WORKSPACE_ID,
      {
        email: createUserDto.email,
        g_id: GROUP_ID,
        username: createUserDto.username,
        user_code: createUserDto.username,
        // dùng tạm password từ form
        tmp_password: createUserDto.password || '12345678',
        no_confirm_email: true,
      },
      hxbToken,
    );

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

  findAll() {}

  findOne() {}

  findByEmail() {}

  findByUser() {}

  update() {}

  remove() {}
}
