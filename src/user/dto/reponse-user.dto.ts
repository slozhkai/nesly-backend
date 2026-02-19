import { IsString, IsEmail, IsEnum, IsUUID } from 'class-validator';
import { UserGender } from '../../enums/user.enum';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsEnum(UserGender)
  gender: UserGender;
}
