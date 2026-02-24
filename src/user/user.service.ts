import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getHash } from '../utils/hash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    if (await this.userRepository.findOneBy({ email: user.email })) {
      throw new BadRequestException(
        'Пользователь с таким Email уже существует',
      );
    }

    if (await this.userRepository.findOneBy({ username: user.username })) {
      throw new BadRequestException(
        'Пользователь с таким именем уже существует',
      );
    }

    const hashPassword = await getHash(
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
