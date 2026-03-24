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

    const newUser = {
      id: newId,
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email,

      // 2. Điền giá trị mặc định cho các trường phục vụ Frontend Table
      key: newId.toString(),
      userCode: `U${newId}`,
      lastName: createUserDto.name, // Lấy name từ DTO nhét tạm vào lastName
      lastNameKana: '',
      name: '',
      nameKana: '',
      departmentCode: '',
      departmentName: 'N/A',
      roleCode: 'USER',
      roleName: 'USER',
      staffCode: '',
      remarks: 'Tài khoản mới tạo',
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

  findOne(id: number) {
    const user = this.users.find((u) => u.id === id);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1)
      throw new NotFoundException(`Không tìm thấy user với id ${id}`);

    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  remove(id: number) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1)
      throw new NotFoundException(`Không tìm thấy user với id ${id}`);

    const deletedUser = this.users.splice(userIndex, 1);
    return deletedUser[0];
  }
}
