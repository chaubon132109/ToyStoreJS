import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateShippingAddressRequestDto } from './create-shipping-address.request.dto';

export class UpdateShippingAddressRequestDto extends CreateShippingAddressRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
