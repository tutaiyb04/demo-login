/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/users/users.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HexabaseService } from '../hexabase/hexabase.service';
import type { ConfigType } from '@nestjs/config';
import { toChecked } from 'src/helper/toChecked';
import hexabaseConfig from 'src/config/hexabase.config';

@Injectable()
export class UsersService {
  constructor(
    private hexabaseService: HexabaseService,
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
  ) {}

  async create(createUserDto: CreateUserDto, hxbToken: any) {
    const adminInfo = await this.hexabaseService.getUserInfo(hxbToken);
    const invitorId = adminInfo.u_id || adminInfo.id;

    const fullName =
      `${createUserDto.lastName || ''} ${createUserDto.firstName || ''}`.trim();
    const password = createUserDto.password || 'Acf@Password2026';

    const workspaceUser = await this.hexabaseService.createWorkspaceUser(
      createUserDto.email,
      this.hxbConfig.groupId,
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
      staffCode: createUserDto.staffCode || '',
      remarks: createUserDto.remarks,
      role: createUserDto.roleCode,
      isApprover:
        createUserDto.isApprover && this.hxbConfig.isApproverOptionId
          ? [this.hxbConfig.isApproverOptionId]
          : [],
      canProxyApply:
        createUserDto.canProxyApply && this.hxbConfig.canProxyApplyOptionId
          ? [this.hxbConfig.canProxyApplyOptionId]
          : [],
      canProxyApprove:
        createUserDto.canProxyApprove && this.hxbConfig.canProxyApproveOptionId
          ? [this.hxbConfig.canProxyApproveOptionId]
          : [],
      workspaceUserId:
        workspaceUser.user_profile?.u_id ||
        workspaceUser.u_id ||
        workspaceUser.id ||
        '',
    };
    console.log(workspaceUser);

    const result = await this.hexabaseService.createItem(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
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

  async findAll(hxbToken: string, page = 1, perPage = 10) {
    const { items, total } = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      hxbToken,
      1,
      0,
    );

    const mappedUsers = items.map((item: any) => {
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

    return { items: mappedUsers, total, page, perPage };
  }

  async findOne(userCode: string, hxbToken: string) {
    const response = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      hxbToken,
      1,
      0,
    );

    const item = response.items.find((x: any) => x.userCode === userCode);

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
    const response = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      hxbToken,
      1,
      0,
    );

    const target = response.items.find((x: any) => x.userCode === userCode);
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
        dto.isApprover && this.hxbConfig.isApproverOptionId
          ? [this.hxbConfig.isApproverOptionId]
          : [],
      canProxyApply:
        dto.canProxyApply && this.hxbConfig.canProxyApplyOptionId
          ? [this.hxbConfig.canProxyApplyOptionId]
          : [],
      canProxyApprove:
        dto.canProxyApprove && this.hxbConfig.canProxyApproveOptionId
          ? [this.hxbConfig.canProxyApproveOptionId]
          : [],
      workspaceUserId: target.workspaceUserId || '',
    };

    const result = await this.hexabaseService.updateItem(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
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
    const response = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      hxbToken,
      1,
      0,
    );

    const target = response.items.find((x: any) => x.userCode === userCode);
    if (!target?.i_id) {
      throw new NotFoundException('User not found');
    }

    try {
      if (target.workspaceUserId) {
        await this.hexabaseService.removeWorkspaceUser(
          this.hxbConfig.groupId,
          target.workspaceUserId,
          hxbToken,
          this.hxbConfig.workspaceId,
        );
      }
    } catch (error) {
      console.warn('removeWorkspaceUser failed, continue deleteItem:', error);
    }

    await this.hexabaseService.deleteItem(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      target.i_id,
      hxbToken,
    );
    return { message: 'DELETE USER SUCCESSFULLY' };
  }
}
