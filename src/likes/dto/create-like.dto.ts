import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum LikeType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export class CreateLikeDto {
  @IsOptional()
  @IsEnum(LikeType)
  likeType?: LikeType;

  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
