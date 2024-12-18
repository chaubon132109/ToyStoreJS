import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetListDiscountResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  percent: number;

  @ApiProperty()
  @Expose()
  startApply: Date;

  @ApiProperty()
  @Expose()
  endApply: Date;

  @ApiProperty()
  @Expose()
  status: number;
}
