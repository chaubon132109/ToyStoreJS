import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateOrderDetailRequestDto } from './create-order-detail.request.dto';

export class UpdateOrderDetailRequestDto extends CreateOrderDetailRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
