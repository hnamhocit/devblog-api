import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsUrl()
  photoURL?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  refreshToken?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  skillsAndLanguages?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  learning?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  hackingOn?: string;
}
