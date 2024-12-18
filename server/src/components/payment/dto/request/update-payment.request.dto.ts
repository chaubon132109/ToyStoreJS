import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { CreatePaymentRequestDto } from './create-payment.request.dto';

export class UpdatePaymentRequestDto extends CreatePaymentRequestDto {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
