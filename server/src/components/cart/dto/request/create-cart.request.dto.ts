import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { ObjectId, Types } from 'mongoose';

export class CreateCartRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  itemId: string;

  @ApiProperty()
  @Type(() => Number)
  quantity: number;
}
