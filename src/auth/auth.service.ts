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

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
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

    return {
      access_token,
    };
  }
}
