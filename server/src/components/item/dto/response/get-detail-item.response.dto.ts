import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Discount } from './get-list-item.response.dto';

export class GetDetailItemResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  nameEn: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  categoryId: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  length: number;

  @ApiProperty()
  @Expose()
  width: number;

  @ApiProperty()
  @Expose()
  height: number;

  @ApiProperty()
  @Expose()
  weight: number;

  @ApiProperty()
  @Expose()
  age: number;

  @ApiProperty()
  @Expose()
  gender: String;

  @ApiProperty()
  @Expose()
  sku: number;

  @ApiProperty()
  @Expose()
  stockQuantity: number;

  @ApiProperty()
  @Expose()
  isTiktokProduct: boolean;

  @ApiProperty()
  @Expose()
  tiktokId: string;

  @ApiProperty()
  @Type(() => BaseResponseDto)
  @Expose()
  category: BaseResponseDto;

  @ApiProperty()
  @Type(() => Discount)
  @Expose()
  discount: Discount;

  @ApiProperty()
  @Expose()
  images: any[];
}
