import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  status: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => value.toString().trim())
  description: string;
}
