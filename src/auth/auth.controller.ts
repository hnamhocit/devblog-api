import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

import { AccessTokenGuard, RefreshTokenGuard } from '../common/guards';
import { HttpResponse } from '../transform.interceptor';
import { CreateUserDto } from '../users/dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<HttpResponse<Tokens>> {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signin(@Body() data: AuthDto): Promise<HttpResponse<Tokens>> {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request): Promise<HttpResponse<User>> {
    return this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request): Promise<HttpResponse<Tokens>> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
