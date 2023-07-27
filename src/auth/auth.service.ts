import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { HttpResponse } from '../transform.interceptor';
import { CreateUserDto } from '../users/dto';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<HttpResponse<Tokens>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        return {
          statusCode: 409,
          success: false,
          message: 'Email already exists!',
          data: null,
        };
      }

      const hashedPassword = await hash(createUserDto.password);

      const data = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      const tokens = await this.getTokens(data.id, data.email);
      await this.updateRefreshToken(data.id, tokens.refreshToken);

      return {
        message: 'User signed up successfully!',
        data: tokens,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error signing up user: ' + error.message,
        data: null,
      };
    }
  }

  async signIn(authDto: AuthDto): Promise<HttpResponse<Tokens>> {
    try {
      const data = await this.prisma.user.findUnique({
        where: { email: authDto.email },
      });

      if (!data) {
        return {
          statusCode: 404,
          success: false,
          message: 'User not found!',
          data: null,
        };
      }

      const passwordMatches = await verify(data.password, authDto.password);
      if (!passwordMatches) {
        return {
          statusCode: 400,
          success: false,
          message: 'Password is incorrect!',
          data: null,
        };
      }

      const tokens = await this.getTokens(data.id, data.email);
      await this.updateRefreshToken(data.id, tokens.refreshToken);

      return {
        message: 'User logged in successfully!',
        data: tokens,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error signing in user: ' + error.message,
        data: null,
      };
    }
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<HttpResponse<Tokens>> {
    try {
      const data = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!data || !data.refreshToken) {
        return {
          statusCode: 403,
          success: false,
          message: 'Access denied!',
          data: null,
        };
      }

      const refreshTokenMatches = await verify(data.refreshToken, refreshToken);

      if (!refreshTokenMatches) {
        return {
          statusCode: 403,
          success: false,
          message: 'Access denied!',
          data: null,
        };
      }

      const tokens = await this.getTokens(data.id, data.email);
      await this.updateRefreshToken(data.id, tokens.refreshToken);

      return {
        message: 'Refresh token updated successfully!',
        data: tokens,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error refreshing token: ' + error.message,
        data: null,
      };
    }
  }

  async logout(userId: string): Promise<HttpResponse<User>> {
    try {
      const data = await this.prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
        },
      });

      return {
        message: `User logged out successfully!`,
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error logging out: ' + error.message,
        data: null,
      };
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
