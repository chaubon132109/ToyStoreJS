import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateShippingMethodRequestDto } from './create-shipping-method.request.dto';

export class UpdateShippingMethodRequestDto extends CreateShippingMethodRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
