import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/reponse-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): UserResponseDto {
    return this.userService.create(createUserDto);
  }

  @Get()
  find(): UserResponseDto[] {
    return this.userService.findAll();
  }
}
