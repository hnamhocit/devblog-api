import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { HttpResponse } from '../transform.interceptor';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<HttpResponse<Tag[]>> {
    try {
      const data = await this.prisma.tag.findMany({
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
      });

      return {
        message: 'Tags retrieved successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error retrieving tag: ' + error.message,
        data: null,
      };
    }
  }

  async findOne(name: string): Promise<HttpResponse<Tag>> {
    try {
      const data = await this.prisma.tag.findUnique({
        where: { name },
        include: {
          posts: {
            include: {
              author: true,
              tags: true,
              _count: {
                select: { comments: true },
              },
            },
          },
        },
      });

      return {
        message: 'Tag retrieved successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error retrieving tag:' + error.message,
        data: null,
      };
    }
  }

  async create(createTagDto: CreateTagDto): Promise<HttpResponse<Tag>> {
    try {
      const existingTagDto = await this.prisma.tag.findUnique({
        where: { name: createTagDto.name },
      });

      if (existingTagDto) {
        return {
          statusCode: 409,
          success: false,
          message: 'Tag already exists!',
          data: existingTagDto,
        };
      }

      const data = await this.prisma.tag.create({ data: createTagDto });

      return {
        message: 'Tag created successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error creating tag: ' + error.message,
        data: null,
      };
    }
  }

  async update(
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<HttpResponse<Tag>> {
    try {
      const existingTag = await this.prisma.tag.findUnique({ where: { id } });

      if (!existingTag) {
        return {
          statusCode: 404,
          success: false,
          message: 'Tag not found!',
          data: null,
        };
      }

      const data = await this.prisma.tag.update({
        where: { id },
        data: updateTagDto,
      });

      return {
        message: 'Tag updated successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error updating tag: ' + error.message,
        data: null,
      };
    }
  }

  async remove(id: string): Promise<HttpResponse<Tag>> {
    try {
      const existingTag = await this.prisma.tag.findUnique({ where: { id } });

      if (!existingTag) {
        return {
          statusCode: 404,
          success: false,
          message: 'Tag not found!',
          data: null,
        };
      }

      const data = await this.prisma.tag.delete({ where: { id } });

      return {
        message: 'Tag deleted successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error removing tag: ' + error.message,
        data: null,
      };
    }
  }
}
