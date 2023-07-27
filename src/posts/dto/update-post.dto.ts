import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Tag } from './create-post.dto';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  thumbnailURL?: string;

  @IsOptional()
  @IsNumber()
  numberOfViews?: number;

  @ValidateNested({ each: true })
  @Type(() => Tag)
  @ArrayNotEmpty()
  @ArrayMaxSize(4)
  tags?: Tag[];
}
