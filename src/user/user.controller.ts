import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/reponse-user.dto';
import { userEntityToDto } from './user.mappers';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto).then(userEntityToDto);
  }

  @Get()
  async find(): Promise<UserResponseDto[]> {
    return this.userService
      .findAll()
      .then((users) => users.map(userEntityToDto));
  }
}
