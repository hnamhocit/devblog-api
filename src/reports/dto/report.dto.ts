import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class ReportDto {
  @IsString()
  @IsNotEmpty()
  option: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  message?: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
