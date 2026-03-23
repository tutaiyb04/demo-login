// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MockUsers } from '../../common/mock/db.mock';

@Injectable()
export class UsersService {
  private users = MockUsers; // Load Database giả

  create(createUserDto: CreateUserDto) {
    // Check xem email đã tồn tại chưa
    const isExist = this.users.find((u) => u.email === createUserDto.email);
    if (isExist) {
      throw new Error('Email đã tồn tại'); // NestJS sẽ tự bắt lỗi này
    }

    const newUser = {
      id: Date.now(), // Tạo ID ngẫu nhiên
      ...createUserDto,
      role: 'USER', // Mặc định role
    };
    this.users.push(newUser);
    return newUser;
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
