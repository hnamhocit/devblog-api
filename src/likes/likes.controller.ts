import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Like } from '@prisma/client';

import { AccessTokenGuard } from '../common/guards';
import { HttpResponse } from '../transform.interceptor';
import { CreateLikeDto } from './dto';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Body() createLikeDto: CreateLikeDto,
  ): Promise<HttpResponse<Like>> {
    return this.likesService.create(createLikeDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLikeDto: CreateLikeDto,
  ): Promise<HttpResponse<Like>> {
    return this.likesService.update(id, updateLikeDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<HttpResponse<Like>> {
    return this.likesService.remove(id);
  }
}
