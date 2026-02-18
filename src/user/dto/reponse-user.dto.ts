import { IsString, IsEmail, IsEnum, IsUUID } from 'class-validator';
import { UserSex } from '../../enums/user.enum';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsEnum(UserSex)
  sex: UserSex;
}
