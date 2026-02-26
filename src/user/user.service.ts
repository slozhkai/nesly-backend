import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(user: UserDto): Promise<UserEntity> {
    const hashPassword = await bcrypt.hash(
      user.password,
      Number(this.configService.get<number>('HASH_SALT')) || 10,
    );

    return this.userRepository.save({
      ...user,
      password: hashPassword,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
