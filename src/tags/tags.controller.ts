import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Tag } from '@prisma/client';

import { HttpResponse } from '../transform.interceptor';
import { CreateTagDto, UpdateTagDto } from './dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(): Promise<HttpResponse<Tag[]>> {
    return this.tagsService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string): Promise<HttpResponse<Tag>> {
    return this.tagsService.findOne(name);
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
