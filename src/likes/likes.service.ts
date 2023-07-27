import { Injectable } from '@nestjs/common';
import { Like } from '@prisma/client';

import { HttpResponse } from 'src/transform.interceptor';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLikeDto } from './dto';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto): Promise<HttpResponse<Like>> {
    try {
      const data = await this.prisma.like.create({ data: createLikeDto });

      return {
        message: 'Like created successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error creating like: ' + error.message,
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateLikeDto: CreateLikeDto,
  ): Promise<HttpResponse<Like>> {
    try {
      const existingLike = await this.prisma.like.findUnique({ where: { id } });

      if (!existingLike) {
        return {
          statusCode: 404,
          success: false,
          message: 'Like not found!',
          data: null,
        };
      }

      const data = await this.prisma.like.update({
        where: { id },
        data: updateLikeDto,
      });

      return {
        message: 'Like updated successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error updating like: ' + error.message,
        data: null,
      };
    }
  }

  async remove(id: string): Promise<HttpResponse<Like>> {
    try {
      const existingLike = await this.prisma.like.findUnique({ where: { id } });

      if (!existingLike) {
        return {
          statusCode: 404,
          success: false,
          message: 'Like not found!',
          data: null,
        };
      }

      const data = await this.prisma.like.delete({
        where: { id },
      });

      return {
        message: 'Like removed successfully!',
        data: data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error removing like: ' + error.message,
        data: null,
      };
    }
  }
}
