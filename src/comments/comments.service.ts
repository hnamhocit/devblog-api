import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { HttpResponse } from '../transform.interceptor';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<HttpResponse<Comment>> {
    try {
      const data = await this.prisma.comment.create({
        data: createCommentDto,
      });

      return {
        message: 'Comment created successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error creating comment: ' + error.message,
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<HttpResponse<Comment>> {
    try {
      const existingComment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!existingComment) {
        return {
          statusCode: 404,
          success: false,
          message: 'Comment not found!',
          data: null,
        };
      }

      const data = await this.prisma.comment.update({
        where: {
          id,
        },
        data: updateCommentDto,
      });

      return {
        message: 'Comment updated successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error updating comment: ' + error.message,
        data: null,
      };
    }
  }

  async remove(id: string): Promise<HttpResponse<Comment>> {
    try {
      const existingComment = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!existingComment) {
        return {
          statusCode: 404,
          success: false,
          message: 'Comment not found!',
          data: null,
        };
      }

      const data = await this.prisma.comment.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Comment removed successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error removing comment: ' + error.message,
        data: null,
      };
    }
  }
}
