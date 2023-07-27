import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Report } from '@prisma/client';
import { HttpResponse } from 'src/transform.interceptor';

import { AccessTokenGuard } from '../common/guards';
import { ReportDto } from './dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll(): Promise<HttpResponse<Report[]>> {
    return this.reportsService.findAll();
  }

  @Post()
  async create(@Body() reportDto: ReportDto): Promise<HttpResponse<Report>> {
    return this.reportsService.create(reportDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<HttpResponse<Report>> {
    return this.reportsService.remove(id);
  }
}
