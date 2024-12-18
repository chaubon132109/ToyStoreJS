import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import {
  CreateFormItemRequestDto,
  CreateItemRequestDto,
} from './create-item.request.dto';

export class UpdateItemRequestDto extends CreateFormItemRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
