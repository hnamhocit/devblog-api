import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsHexColor,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Tag {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsHexColor()
  color: string;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  thumbnailURL: string;

  @ValidateNested({ each: true })
  @Type(() => Tag)
  @ArrayNotEmpty()
  @ArrayMaxSize(4)
  tags: Tag[];

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
