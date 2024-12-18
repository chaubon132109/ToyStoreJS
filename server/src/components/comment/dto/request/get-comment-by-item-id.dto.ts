import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { BaseDto } from 'src/core/dto/base.dto';

export class GetListCommentByItemRequestDto extends PaginationQuery {
  @ApiProperty()
  @IsOptional()
  itemId: string;
}
