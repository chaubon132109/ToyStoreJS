import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateCategoryRequestDto } from './create-category.request.dto';

export class UpdateCategoryRequestDto extends CreateCategoryRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
