import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/reponse-user.dto';
import { userEntityToDto } from './user.mappers';

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
