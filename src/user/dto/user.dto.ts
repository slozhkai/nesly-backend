import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender } from '../../enums/user.enum';

export class UserDto {
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'Имя пользователя обязательно' })
  @MinLength(3, {
    message: 'Имя пользователя должно содержать минимум 3 символа',
  })
  @MaxLength(20, {
    message: 'Имя пользователя должно содержать максимум 20 символов',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Имя пользователя должно содержать только буквы, цифры и подчеркивания',
  })
  username: string;

  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @MaxLength(50, { message: 'Пароль должен содержать максимум 50 символов' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру',
  })
  password: string;

  @IsEnum(UserGender, { message: 'Некорректное значение пола' })
  gender: UserGender;
}

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
