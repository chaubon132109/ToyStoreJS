import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateOrderRequestDto } from './create-order.request.dto';

export class UpdateOrderRequestDto extends CreateOrderRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
