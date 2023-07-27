import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Post as IPost } from '@prisma/client';

import { AccessTokenGuard } from '../common/guards';
import { HttpResponse } from '../transform.interceptor';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(): Promise<HttpResponse<IPost[]>> {
    return this.postsService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<HttpResponse<IPost>> {
    return this.postsService.findOne(slug);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':slug')
  async remove(@Param('slug') slug: string): Promise<HttpResponse<IPost>> {
    return this.postsService.remove(slug);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<HttpResponse<IPost>> {
    return this.postsService.update(slug, updatePostDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<HttpResponse<IPost>> {
    return this.postsService.create(createPostDto);
  }

  @Patch(':slug/views')
  async updateViews(@Param('slug') slug: string): Promise<HttpResponse<IPost>> {
    return this.postsService.updateViews(slug);
  }

  @Post('search/:query')
  async search(@Param('query') query: string): Promise<HttpResponse<IPost[]>> {
    return this.postsService.search(query);
  }
}
