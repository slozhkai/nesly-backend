import { Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  create(user: CreateUserDto): User {
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }
}
