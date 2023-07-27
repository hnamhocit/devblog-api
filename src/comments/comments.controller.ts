import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Comment } from '@prisma/client';

import { AccessTokenGuard } from '../common/guards';
import { HttpResponse } from '../transform.interceptor';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<HttpResponse<Comment>> {
    return this.commentsService.create(createCommentDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<HttpResponse<Comment>> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<HttpResponse<Comment>> {
    return this.commentsService.remove(id);
  }
}
