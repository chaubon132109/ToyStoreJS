import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateCommentRequestDto } from './create-comment.request.dto';

export class UpdateCommentRequestDto extends CreateCommentRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
