import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignDto } from './dto/sign.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() data: SignDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const { access_token } = await this.authService.signIn(
      data.username,
      data.password,
    );

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 15 * 1000,
    });

    return { message: 'Success' };
  }
}
