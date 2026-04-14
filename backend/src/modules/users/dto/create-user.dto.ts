// src/modules/users/dto/create-user.dto.ts
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  firstNameKana?: string;

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
  positionCode?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  roleCode?: string;

  @IsString()
  @IsOptional()
  staffCode?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsBoolean()
  @IsOptional()
  isApproval?: boolean;

  @IsBoolean()
  @IsOptional()
  canProxyApply?: boolean;

  @IsBoolean()
  @IsOptional()
  canProxyApprove?: boolean;
}
