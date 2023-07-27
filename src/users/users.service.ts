import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { HttpResponse } from '../transform.interceptor';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<HttpResponse<User[]>> {
    try {
      const data = await this.prisma.user.findMany();

      return {
        message: 'Retrieved users successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error retrieving users: ' + error.message,
        data: null,
      };
    }
  }

  async findOne(id: string): Promise<HttpResponse<User>> {
    try {
      const data = await this.prisma.user.findUnique({
        where: { id },
        include: {
          posts: true,
          comments: true,
          likes: true,
        },
      });

      if (!data) {
        return {
          statusCode: 404,
          success: false,
          message: 'User not found!',
          data: null,
        };
      }

      return {
        message: 'User found successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error finding user: ' + error.message,
        data: null,
      };
    }
  }

  async create(createUserDto: CreateUserDto): Promise<HttpResponse<User>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        return {
          statusCode: 409,
          success: false,
          message: 'Email already exists!',
          data: existingUser,
        };
      }

      const data = await this.prisma.user.create({
        data: createUserDto,
      });

      return {
        message: 'User created successfully!',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error creating user: ' + error.message,
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<HttpResponse<User>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return {
          statusCode: 404,
          success: false,
          message: 'User not found!',
          data: null,
        };
      }

      const data = await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });

      return {
        message: 'User updated successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error updating user: ' + error.message,
        data: null,
      };
    }
  }

  async remove(id: string): Promise<HttpResponse<User>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!existingUser) {
        return {
          statusCode: 404,
          success: false,
          message: 'User not found!',
          data: null,
        };
      }

      const data = await this.prisma.user.delete({
        where: { id },
      });

      return {
        message: 'User removed successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error removing user: ' + error.message,
        data: null,
      };
    }
  }
}
