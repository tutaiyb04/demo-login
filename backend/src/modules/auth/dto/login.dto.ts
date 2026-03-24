import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(3, { message: 'Password phải có ít nhất 3 ký tự' })
  password: string;
}
