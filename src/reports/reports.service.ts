import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Report } from '@prisma/client';
import axios from 'axios';

import { PrismaService } from '../prisma/prisma.service';
import { HttpResponse } from '../transform.interceptor';
import { ReportDto } from './dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async findAll(): Promise<HttpResponse<Report[]>> {
    try {
      const data = await this.prisma.report.findMany();

      return {
        message: 'All reports found!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error :' + error.message,
        data: null,
      };
    }
  }

  async create(reportDto: ReportDto): Promise<HttpResponse<Report>> {
    try {
      const { token, ...rest } = reportDto;
      const SECRET_KEY = this.config.get('SECRET_KEY');

      const res = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`,
      );

      if (res.data.success) {
        const data = await this.prisma.report.create({
          data: rest,
        });

        return {
          message: 'Report created successfully!',
          data,
        };
      }

      return {
        statusCode: 200,
        success: false,
        message: 'You are robot 🤖!',
        data: null,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error creating report :' + error.message,
        data: null,
      };
    }
  }

  async remove(id: string): Promise<HttpResponse<Report>> {
    try {
      const existingReport = await this.prisma.report.findUnique({
        where: { id },
      });

      if (!existingReport) {
        return {
          statusCode: 404,
          success: false,
          message: 'Report not found!',
          data: null,
        };
      }

      const data = await this.prisma.report.delete({ where: { id } });

      return {
        message: 'Report deleted successfully!',
        data,
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'Error :' + error.message,
        data: null,
      };
    }
  }
}
