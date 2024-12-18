import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class Discount extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  percent: number;
}

export class GetListItemResponseDto {
  @ApiProperty()
  @Expose({ name: '_id' })
  @Transform((value) => value.obj._id?.toString() || value.obj.id)
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
  @Type(() => BaseResponseDto)
  category: BaseResponseDto;

  @ApiProperty()
  @Expose()
  @Type(() => Discount)
  discount: Discount;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  lenght: number;

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
  isTikTokProduct: boolean;

  @ApiProperty()
  @Expose()
  tiktokId: string;

  @ApiProperty()
  @Expose()
  images: any[];
}
