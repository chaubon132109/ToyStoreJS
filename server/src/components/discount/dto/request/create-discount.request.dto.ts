import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDiscountRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  discount: number;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  startApply: Date;

  @ApiProperty()
  @IsOptional()
  endApply: Date;
}
