import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateCartRequestDto } from './create-cart.request.dto';

export class UpdateCartRequestDto extends CreateCartRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
