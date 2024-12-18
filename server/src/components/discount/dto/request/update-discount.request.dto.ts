import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateDiscountRequestDto } from './create-discount.request.dto';

export class UpdateDiscountRequestDto extends CreateDiscountRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
