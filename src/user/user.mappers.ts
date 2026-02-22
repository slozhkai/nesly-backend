import { UserEntity } from '../entities/user.entity';
import { UserResponseDto } from './dto/reponse-user.dto';

export function userEntityToDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    gender: user.gender,
  };
}