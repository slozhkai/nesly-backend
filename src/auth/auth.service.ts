import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { userEntityToDto } from '../user/user.mappers';
import { RequestSignUpDto, ResponseSignUpDto } from './dto/signUp.dto';
import { SignInResponse } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  async signIn(username: string, password: string): Promise<SignInResponse> {
    if (!username || !password) throw new BadRequestException();

    const user = await this.userRepository.findOneBy({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const access_token = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.username,
      },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    const refresh_token = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.username,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );

    await this.userRepository.update(user.id, {
      refresh_token: await bcrypt.hash(
        refresh_token,
        Number(this.configService.get<number>('HASH_SALT')) || 10,
      ),
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async signUp(user: RequestSignUpDto): Promise<ResponseSignUpDto> {
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

    return await this.userService.create(user).then(userEntityToDto);
  }
}
