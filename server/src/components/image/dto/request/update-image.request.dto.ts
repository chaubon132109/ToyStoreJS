import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateImageRequestDto } from './create-image.request.dto';

export class UpdateImageRequestDto extends CreateImageRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
