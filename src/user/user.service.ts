import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      if (await this.userRepository.find({ where: { email: user.email } })) {
        new BadRequestException('Пользователь с таким Email уже существует');
      }

      if (
        await this.userRepository.find({ where: { username: user.username } })
      ) {
        new BadRequestException('Пользователь с таким именем уже существует');
      }

      return this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException('Error: ' + err);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return this.userRepository.find();
    } catch (err) {
      throw new InternalServerErrorException('Error: ' + err);
    }
  }
}
