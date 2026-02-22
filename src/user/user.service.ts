import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    if (await this.userRepository.find({ where: { email: user.email } })) {
      throw new BadRequestException(
        'Пользователь с таким Email уже существует',
      );
    }

    if (
      await this.userRepository.find({ where: { username: user.username } })
    ) {
      throw new BadRequestException(
        'Пользователь с таким именем уже существует',
      );
    }

    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
