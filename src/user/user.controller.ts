import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { userEntityToDto } from './user.mappers';
import { UserResponseDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async find(): Promise<UserResponseDto[]> {
    return this.userService
      .findAll()
      .then((users) => users.map(userEntityToDto));
  }
}
