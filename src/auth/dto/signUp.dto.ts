import { UserDto, UserResponseDto } from 'src/user/dto/user.dto';
import { IsString } from 'class-validator';

export class RequestSignUpDto extends UserDto {}

export class ResponseSignUpDto extends UserResponseDto {
  @IsString()
  access_token?: string;

  @IsString()
  refresh_token?: string;
}
