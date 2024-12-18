import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetListCategoryResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  totalStockQuantity: string;

  @ApiProperty()
  @Expose()
  minPrice: string;

  @ApiProperty()
  @Expose()
  maxPrice: string;

  @ApiProperty()
  @Expose()
  createdBy: any;

  @ApiProperty()
  @Expose()
  status: number;
}
