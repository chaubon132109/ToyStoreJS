import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { isJson } from 'src/helper/string.helper';

export class CreateUserRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  nameEn: string;

  @ApiProperty()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => {
    if (isJson(value)) {
      return JSON.parse(value);
    }
    return value;
  })
  @Type(() => Object)
  password: any;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => {
    if (isJson(value)) {
      return JSON.parse(value);
    }
    return value;
  })
  @Type(() => Object)
  role: any;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsOptional()
  gender: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  dob: Date;
}
