/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HexabaseService } from '../hexabase/hexabase.service';

@Injectable()
export class UsersService {
  constructor(private hexabaseService: HexabaseService) {}

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

    const PROJECT_ID = '69c38776aef0277b05ab6220';
    const DATASTORE_ID = '69c48d493ad73cf404e2bc5c';

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

  findAll() {}

  findOne() {}

  findByEmail() {}

  findByUser() {}

  update() {}

  remove() {}
}
