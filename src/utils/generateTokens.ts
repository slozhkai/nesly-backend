import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

type GenerateTokensProps = {
  id: string;
  username: string;
};

@Injectable()
export class GenerateTokens {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken({
    id,
    username,
  }: GenerateTokensProps): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: id,
        username: username,
      },
      {
        expiresIn: '15m',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
  }

  async generateRefreshToken({
    id,
    username,
  }: GenerateTokensProps): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: id,
        username: username,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );
  }
}
