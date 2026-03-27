/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HexabaseService } from '../hexabase/hexabase.service';
import { ConfigService } from '@nestjs/config';
import { toChecked } from 'src/helper/toChecked';

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
    const IS_APPROVER_OPTION_ID =
      this.configService.get<string>('IS_APPROVER_OPTION_ID') || '';
    const CAN_PROXY_APPLY_OPTION_ID =
      this.configService.get<string>('CAN_PROXY_APPLY_OPTION_ID') || '';
    const CAN_PROXY_APPROVE_OPTION_ID =
      this.configService.get<string>('CAN_PROXY_APPROVE_OPTION_ID') || '';

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
      isApprover:
        createUserDto.isApprover && IS_APPROVER_OPTION_ID
          ? [IS_APPROVER_OPTION_ID]
          : [],
      canProxyApply:
        createUserDto.canProxyApply && CAN_PROXY_APPLY_OPTION_ID
          ? [CAN_PROXY_APPLY_OPTION_ID]
          : [],
      canProxyApprove:
        createUserDto.canProxyApprove && CAN_PROXY_APPROVE_OPTION_ID
          ? [CAN_PROXY_APPROVE_OPTION_ID]
          : [],
      workspaceUserId:
        workspaceUser.user_profile?.u_id ||
        workspaceUser.u_id ||
        workspaceUser.id ||
        '',
    };
    console.log(workspaceUser);

    const result = await this.hexabaseService.createItem(
      PROJECT_ID,
      DATASTORE_ID,
      datastorePayload,
      hxbToken,
    );

    return {
      message: 'Create user successfully on both Workspace and Datastore',
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

    const mappedUsers = rawItems.map((item: any) => {
      return {
        key: item.i_id,
        userCode: item.userCode || '',
        lastName: item.lastName || '',
        lastNameKana: item.lastNameKana || '',
        name: item.firstName || '',
        nameKana: item.firstNameKana || '',
        departmentCode: item.departmentCode || '',
        departmentName: item.departmentName || item.departmentCode || '',
        roleCode: item.role || '',
        roleName: item.role || '',
        email: item.email || '',
        staffCode: item.staffCode || '',
        workspaceUserId: item.workspaceUserId || '',
        remarks: item.remarks || '',
        lastLogin: item.lastLogin || item.updated_at || item.created_at || '',
      };
    });

    return mappedUsers;
  }

  async findOne(userCode: string, hxbToken: string) {
    const PROJECT_ID =
      this.configService.get<string>('HEXABASE_PROJECT_ID') || '';
    const DATASTORE_ID =
      this.configService.get<string>('HEXABASE_USER_DATASTORE_ID') || '';

    const rawItems = await this.hexabaseService.searchItems(
      PROJECT_ID,
      DATASTORE_ID,
      hxbToken,
    );

    const item = rawItems.find((x: any) => x.userCode === userCode);

    if (!item) {
      throw new NotFoundException('User not found');
    }

    return {
      i_id: item.i_id,
      userCode: item.userCode || '',
      lastName: item.lastName || '',
      firstName: item.firstName || '',
      lastNameKana: item.lastNameKana || '',
      firstNameKana: item.firstNameKana || '',
      departmentCode: item.departmentCode || null,
      positionCode: item.positionCode || null,
      email: item.email || '',
      startDate: item.startDate || null,
      staffCode: item.staffCode || '',
      remarks: item.remarks || '',
      roleCode: item.role || null,
      isApprover: toChecked(item.isApprover),
      canProxyApply: toChecked(item.canProxyApply),
      canProxyApprove: toChecked(item.canProxyApprove),
    };
  }

  async update(userCode: string, dto: CreateUserDto, hxbToken: string) {
    const PROJECT_ID =
      this.configService.get<string>('HEXABASE_PROJECT_ID') || '';
    const DATASTORE_ID =
      this.configService.get<string>('HEXABASE_USER_DATASTORE_ID') || '';
    const IS_APPROVER_OPTION_ID =
      this.configService.get<string>('IS_APPROVER_OPTION_ID') || '';
    const CAN_PROXY_APPLY_OPTION_ID =
      this.configService.get<string>('CAN_PROXY_APPLY_OPTION_ID') || '';
    const CAN_PROXY_APPROVE_OPTION_ID =
      this.configService.get<string>('CAN_PROXY_APPROVE_OPTION_ID') || '';

    const rawItems = await this.hexabaseService.searchItems(
      PROJECT_ID,
      DATASTORE_ID,
      hxbToken,
    );

    const target = rawItems.find((x: any) => x.userCode === userCode);
    if (!target?.i_id) {
      throw new NotFoundException('User not found');
    }

    const updatePayload = {
      userCode: dto.username,
      lastName: dto.lastName,
      firstName: dto.firstName,
      lastNameKana: dto.lastNameKana,
      firstNameKana: dto.firstNameKana,
      departmentCode: dto.departmentCode,
      positionCode: dto.positionCode,
      email: dto.email,
      startDate: dto.startDate,
      staffCode: dto.staffCode,
      remarks: dto.remarks,
      role: dto.roleCode,
      isApprover:
        dto.isApprover && IS_APPROVER_OPTION_ID ? [IS_APPROVER_OPTION_ID] : [],
      canProxyApply:
        dto.canProxyApply && CAN_PROXY_APPLY_OPTION_ID
          ? [CAN_PROXY_APPLY_OPTION_ID]
          : [],
      canProxyApprove:
        dto.canProxyApprove && CAN_PROXY_APPROVE_OPTION_ID
          ? [CAN_PROXY_APPROVE_OPTION_ID]
          : [],
      workspaceUserId: target.workspaceUserId || '',
    };

    const result = await this.hexabaseService.updateItem(
      PROJECT_ID,
      DATASTORE_ID,
      target.i_id,
      updatePayload,
      hxbToken,
      Number(target.rev_no),
    );

    return {
      message: 'UPDATE USER SUCCESSFULLY',
      data: result,
    };
  }

  async remove(userCode: string, hxbToken: string) {
    const PROJECT_ID =
      this.configService.get<string>('HEXABASE_PROJECT_ID') || '';
    const DATASTORE_ID =
      this.configService.get<string>('HEXABASE_USER_DATASTORE_ID') || '';
    const GROUP_ID = this.configService.get<string>('HEXABASE_GROUP_ID') || '';
    const WORKSPACE_ID =
      this.configService.get<string>('HEXABASE_WORKSPACE_ID') || '';

    const rawItems = await this.hexabaseService.searchItems(
      PROJECT_ID,
      DATASTORE_ID,
      hxbToken,
    );

    const target = rawItems.find((x: any) => x.userCode === userCode);
    if (!target?.i_id) {
      throw new NotFoundException('User not found');
    }

    try {
      if (target.workspaceUserId) {
        await this.hexabaseService.removeWorkspaceUser(
          GROUP_ID,
          target.workspaceUserId,
          hxbToken,
          WORKSPACE_ID,
        );
      }
    } catch (error) {
      console.warn('removeWorkspaceUser failed, continue deleteItem:', error);
    }

    await this.hexabaseService.deleteItem(
      PROJECT_ID,
      DATASTORE_ID,
      target.i_id,
      hxbToken,
    );
    return { message: 'DELETE USER SUCCESSFULLY' };
  }
}
