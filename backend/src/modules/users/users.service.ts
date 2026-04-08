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
import hexabaseConfig from '@/config/hexabase.config';
import { toChecked } from '@/helper/toChecked';

@Injectable()
export class UsersService {
  constructor(
    @Inject(hexabaseConfig.KEY)
    private hxbConfig: ConfigType<typeof hexabaseConfig>,
    private hexabaseService: HexabaseService,
  ) {}

  private async findLookupItemId(
    datastoreId: string,
    codeField: string,
    codeValue: string | undefined,
    hxbToken: string,
  ): Promise<string | null> {
    if (!codeValue) return null;

    try {
      const res = await this.hexabaseService.searchItems(
        this.hxbConfig.projectId,
        datastoreId,
        hxbToken,
        1,
        1,
        [
          {
            id: codeField,
            search_value: [codeValue],
            exact_match: true,
          },
        ],
      );

      const item = res.items[0];

      return item ? item.i_id : null;
    } catch (error) {
      return null;
    }
  }
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

    const [department_i_id, position_i_id] = await Promise.all([
      this.findLookupItemId(
        this.hxbConfig.departmentDatastoreId,
        'DepartmentCode',
        createUserDto.departmentCode,
        hxbToken,
      ),
      this.findLookupItemId(
        this.hxbConfig.positionDatastoreId,
        'PositionCode',
        createUserDto.positionCode,
        hxbToken,
      ),
    ]);

    const datastorePayload = {
      userCode: createUserDto.username,
      lastName: createUserDto.lastName,
      firstName: createUserDto.firstName,
      lastNameKana: createUserDto.lastNameKana,
      firstNameKana: createUserDto.firstNameKana,
      departmentCode: createUserDto.departmentCode,
      // RoleCode is stored directly on user datastore (role table has been removed).
      role: createUserDto.roleCode || 'GUEST',
      positionCode: createUserDto.positionCode,
      DepartmentLookUp: department_i_id || '',
      PositionLookUp: position_i_id || '',
      email: createUserDto.email,
      startDate: createUserDto.startDate,
      remarks: createUserDto.remarks,
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

    const result = await this.hexabaseService.createItem(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      datastorePayload,
      hxbToken,
    );

    return {
      message: 'Create user successfully on both Workspace and Datastore',
      data: result,
      staffCode:
        result.item?.staffCode ||
        result.item?.staffCodeFieldId ||
        'KONOHA-Auto',
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

    const deptRes = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.departmentDatastoreId,
      hxbToken,
      1,
      0,
    );

    const deptMap: Record<string, string> = {};
    deptRes.items.forEach((d: any) => {
      deptMap[d.DepartmentCode] = d.DepartmentName;
    });

    const posRes = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.positionDatastoreId,
      hxbToken,
      1,
      0,
    );

    const posMap: Record<string, string> = {};
    posRes.items.forEach((p: any) => {
      posMap[p.PositionCode] = p.PositionName || p.title;
    });

    const mappedUsers = items.map((item: any) => {
      const deptCode = item.departmentCode || item.DepartmentLookUp || '';
      const posCode = item.positionCode || item.PositionLookUp || '';
      const rlCode = item.role || item.RoleLookUp || 'GUEST';

      return {
        key: item.i_id,
        userCode: item.userCode || '',
        lastName: item.lastName || '',
        lastNameKana: item.lastNameKana || '',
        name: item.firstName || '',
        nameKana: item.firstNameKana || '',
        departmentCode: deptCode,
        departmentName: deptMap[deptCode] || posCode,
        positionCode: posCode,
        positionName: posMap[posCode] || posCode,
        roleCode: rlCode,
        // With removed role table, keep display name = role code.
        roleName: rlCode,
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
      1,
      [
        {
          id: 'userCode',
          search_value: [userCode],
          exact_match: true,
        },
      ],
    );

    const item = response.items.find((x: any) => x.userCode === userCode);

    if (!item) {
      throw new NotFoundException('User not found');
    }

    const deptCode = item.departmentCode || item.DepartmentLookUp || null;
    const posCode = item.positionCode || item.PositionLookUp || null;
    const rlCode = item.role || item.RoleLookUp || 'GUEST';

    return {
      i_id: item.i_id,
      userCode: item.userCode || '',
      lastName: item.lastName || '',
      firstName: item.firstName || '',
      lastNameKana: item.lastNameKana || '',
      firstNameKana: item.firstNameKana || '',
      departmentCode: deptCode,
      positionCode: posCode,
      roleCode: rlCode,
      email: item.email || '',
      startDate: item.startDate || null,
      staffCode: item.staffCode || '',
      remarks: item.remarks || '',
      isApprover: toChecked(item.isApprover),
      canProxyApply: toChecked(item.canProxyApply),
      canProxyApprove: toChecked(item.canProxyApprove),
    };
  }

  async update(
    userCode: string,
    createUserDto: CreateUserDto,
    hxbToken: string,
  ) {
    const response = await this.hexabaseService.searchItems(
      this.hxbConfig.projectId,
      this.hxbConfig.userDatastoreId,
      hxbToken,
      1,
      0,
    );

    const [department_i_id, position_i_id] = await Promise.all([
      this.findLookupItemId(
        this.hxbConfig.departmentDatastoreId,
        'DepartmentCode',
        createUserDto.departmentCode,
        hxbToken,
      ),
      this.findLookupItemId(
        this.hxbConfig.positionDatastoreId,
        'PositionCode',
        createUserDto.positionCode,
        hxbToken,
      ),
    ]);

    const target = response.items.find((x: any) => x.userCode === userCode);
    if (!target?.i_id) {
      throw new NotFoundException('User not found');
    }

    const updatePayload = {
      userCode: createUserDto.username,
      lastName: createUserDto.lastName,
      firstName: createUserDto.firstName,
      lastNameKana: createUserDto.lastNameKana,
      firstNameKana: createUserDto.firstNameKana,
      departmentCode: createUserDto.departmentCode,
      positionCode: createUserDto.positionCode,
      // RoleCode is stored directly on user datastore (role table has been removed).
      role: createUserDto.roleCode || 'GUEST',
      DepartmentLookUp: department_i_id || '',
      PositionLookUp: position_i_id || '',
      email: createUserDto.email,
      startDate: createUserDto.startDate,
      staffCode: createUserDto.staffCode,
      remarks: createUserDto.remarks,
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
