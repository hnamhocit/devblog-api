import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { HttpResponse } from '../transform.interceptor';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<HttpResponse<Post[]>> {
    try {
      const data = await this.prisma.post.findMany({
        include: {
          author: true,
          tags: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return {
        message: 'Retrieved posts successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error retrieving posts: ' + error.message,
        data: null,
      };
    }
  }

  async findOne(slug: string): Promise<HttpResponse<Post>> {
    try {
      const data = await this.prisma.post.findUnique({
        where: { slug },
        include: {
          author: true,
          tags: true,
          comments: {
            include: {
              author: true,
              likes: true,
            },
          },
        },
      });

      if (!data) {
        return {
          statusCode: 404,
          success: false,
          message: 'Post not found!',
          data: null,
        };
      }

      return {
        message: 'Post found successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Post finding error: ' + error.message,
        data: null,
      };
    }
  }

  async create(createPostDto: CreatePostDto): Promise<HttpResponse<Post>> {
    try {
      const existingPost = await this.prisma.post.findUnique({
        where: {
          slug: createPostDto.slug,
        },
      });

      if (existingPost) {
        return {
          statusCode: 400,
          success: false,
          message: 'Post already exists!',
          data: null,
        };
      }

      const data = await this.prisma.post.create({
        data: {
          ...createPostDto,
          tags: {
            connectOrCreate: createPostDto.tags.map((tag) => ({
              where: { name: tag.name },
              create: tag,
            })),
          },
        },
      });

      return {
        message: 'Post created successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error creating post: ' + error.message,
        data: null,
      };
    }
  }

  async update(
    slug: string,
    updatePostDto: UpdatePostDto,
  ): Promise<HttpResponse<Post>> {
    try {
      const existingPost = await this.prisma.post.findUnique({
        where: {
          slug,
        },
        include: {
          tags: true,
        },
      });

      if (!existingPost) {
        return {
          statusCode: 404,
          success: false,
          message: 'Post not found!',
          data: null,
        };
      }

      const disconnectTags = existingPost.tags.filter(
        (tag) => !updatePostDto.tags.find((t) => t.name === tag.name),
      );

      const data = await this.prisma.post.update({
        where: {
          slug,
        },
        data: {
          ...updatePostDto,
          tags: {
            connectOrCreate: updatePostDto.tags.map((tag) => ({
              where: { name: tag.name },
              create: tag,
            })),
            disconnect: disconnectTags.map((tag) => ({ name: tag.name })),
          },
        },
      });

      return {
        message: 'Post updated successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error updating post: ' + error.message,
        data: null,
      };
    }
  }

  async remove(slug: string): Promise<HttpResponse<Post>> {
    try {
      const existingPost = await this.prisma.post.findUnique({
        where: { slug },
      });

      if (!existingPost) {
        return {
          statusCode: 404,
          success: false,
          message: 'Post not found!',
          data: null,
        };
      }

      const data = await this.prisma.post.delete({
        where: {
          slug,
        },
      });

      return {
        message: 'Post removed successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error removing post: ' + error.message,
        data: null,
      };
    }
  }

  async updateViews(slug: string): Promise<HttpResponse<Post>> {
    try {
      const existingPost = await this.prisma.post.findUnique({
        where: { slug },
      });

      if (!existingPost) {
        return {
          statusCode: 404,
          success: false,
          message: 'Post not found!',
          data: null,
        };
      }

      const data = await this.prisma.post.update({
        where: { slug },
        data: {
          numberOfViews: existingPost.numberOfViews + 1,
        },
      });

      return {
        message: 'Post updated successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error updating views: ' + error.message,
        data: null,
      };
    }
  }

  async search(query: string): Promise<HttpResponse<Post[]>> {
    try {
      const data = await this.prisma.post.findMany({
        where: {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
      });

      return {
        message: 'Searched posts successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error searching posts: ' + error.message,
        data: null,
      };
    }
  }
}
