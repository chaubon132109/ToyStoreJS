import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreateUserRequestDto } from './create-user.request.dto';

export class UpdateUserRequestDto extends CreateUserRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
