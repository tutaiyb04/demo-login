// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MockUsers } from '../../common/mock/db.mock';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users = MockUsers; // Load Database giả

  async create(createUserDto: CreateUserDto) {
    const isExist = this.users.find(
      (u) => u.username === createUserDto.username,
    );
    if (isExist) {
      throw new Error('Username đã tồn tại');
    }

    const newId = Date.now();

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    let mappedRoleName = '一般ユーザー'; // Giá trị mặc định
    switch (createUserDto.roleCode) {
      case 'admin':
        mappedRoleName = '管理者';
        break;
      case 'admin1':
        mappedRoleName = '管理者1';
        break;
      case 'admin2':
        mappedRoleName = '管理者2';
        break;
    }

    // 2. Dịch Department Code thành Department Name
    let mappedDeptName = '';
    if (createUserDto.departmentCode === 'ACFD001') {
      mappedDeptName = 'ACFD001 name';
    }

    const newUser = {
      id: newId,
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email,
      key: newId.toString(),
      userCode: createUserDto.username,
      lastName: createUserDto.lastName || '',
      lastNameKana: createUserDto.lastNameKana || '',
      name: createUserDto.name || '',
      nameKana: createUserDto.nameKana || '',
      departmentCode: createUserDto.departmentCode || '',
      departmentName: mappedDeptName,
      positionCode: createUserDto.positionCode || '',
      positionName:
        createUserDto.positionCode === 'P01'
          ? 'Trưởng phòng'
          : createUserDto.positionCode === 'P02'
            ? 'Nhân viên'
            : '',
      startDate: createUserDto.startDate || '',
      isApprover: createUserDto.isApprover || false,
      canProxyApply: createUserDto.canProxyApply || false,
      canProxyApprove: createUserDto.canProxyApprove || false,
      roleCode: createUserDto.roleCode || 'USER',
      roleName: mappedRoleName,
      staffCode: createUserDto.staffCode || '',
      remarks: createUserDto.remarks || 'Tài khoản mới tạo',
      lastLogin: 'Chưa đăng nhập',
    };
    this.users.push(newUser);
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.roleName,
    };
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((u) => u.userCode === id);
    if (!user) throw new NotFoundException(`Không tìm thấy user với id ${id}`);
    return user;
  }

  findByEmail(email: string) {
    // Hàm này rất quan trọng để bài sau làm Login
    return this.users.find((u) => u.email === email);
  }

  findByUser(username: string) {
    return this.users.find((u) => u.username === username);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((u) => u.userCode === id);
    if (userIndex === -1) throw new NotFoundException(`Không tìm thấy user`);

    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((u) => u.userCode === id);
    if (userIndex === -1) throw new NotFoundException(`Không tìm thấy user`);

    const deletedUser = this.users.splice(userIndex, 1);
    return deletedUser[0];
  }
}
