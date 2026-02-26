import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { userEntityToDto } from '../user/user.mappers';
import { RequestSignUpDto, ResponseSignUpDto } from './dto/signUp.dto';
import { SignInResponse } from './dto/signIn.dto';
import { GenerateTokens } from '../utils/generateTokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly generateTokens: GenerateTokens,
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

    const access_token = await this.generateTokens.generateAccessToken({
      id: user.id,
      username: user.username,
    });

    const refresh_token = await this.generateTokens.generateRefreshToken({
      id: user.id,
      username: user.username,
    });

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

  async signUp(req: RequestSignUpDto): Promise<ResponseSignUpDto> {
    if (await this.userRepository.findOneBy({ email: req.email })) {
      throw new BadRequestException(
        'Пользователь с таким Email уже существует',
      );
    }

    if (await this.userRepository.findOneBy({ username: req.username })) {
      throw new BadRequestException(
        'Пользователь с таким именем уже существует',
      );
    }

    const user = await this.userService.create(req).then(userEntityToDto);
    console.log(user);

    const access_token = await this.generateTokens.generateAccessToken({
      id: user.id,
      username: user.username,
    });

    const refresh_token = await this.generateTokens.generateRefreshToken({
      id: user.id,
      username: user.username,
    });

    await this.userRepository.update(user.id, {
      refresh_token: await bcrypt.hash(
        refresh_token,
        Number(this.configService.get<number>('HASH_SALT')) || 10,
      ),
    });

    return {
      ...user,
      access_token,
      refresh_token,
    };
  }
}
