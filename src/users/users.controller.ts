import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

import { AccessTokenGuard } from '../common/guards';
import { HttpResponse } from '../transform.interceptor';
import { UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(): Promise<HttpResponse<User[]>> {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: Request): Promise<HttpResponse<User>> {
    const id = req.user['sub'];
    return this.usersService.findOne(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HttpResponse<User>> {
    return this.usersService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<HttpResponse<User>> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<HttpResponse<User>> {
    return this.usersService.remove(id);
  }
}
