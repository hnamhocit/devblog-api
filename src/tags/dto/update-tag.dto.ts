import { OmitType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends OmitType(CreateTagDto, ['name']) {}
