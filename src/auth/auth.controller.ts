import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import type { Response } from 'express';
import { UserDto } from '../user/dto/user.dto';
import { ResponseSignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { access_token, refresh_token } = await this.authService.signIn(
      data.username,
      data.password,
    );

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 15 * 1000,
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return { message: 'Success' };
  }

  @Post('sign-up')
  async signU(@Body() user: UserDto): Promise<ResponseSignUpDto> {
    return this.authService.signUp(user);
  }
}
