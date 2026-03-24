// src/modules/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(3, { message: 'Password phải có ít nhất 3 ký tự' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  // --- THÊM CÁC TRƯỜNG MỚI DƯỚI ĐÂY ---

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  lastNameKana?: string;

  @IsString()
  @IsOptional()
  nameKana?: string;

  @IsString()
  @IsOptional()
  departmentCode?: string;

  @IsString()
  @IsOptional()
  roleCode?: string;

  @IsString()
  @IsOptional()
  staffCode?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
