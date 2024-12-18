import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetListOrderResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Expose()
  user: any;

  @ApiProperty()
  @Expose()
  paymentStatus: number;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  tiktokOrderStatus: number;

  @ApiProperty()
  @Expose()
  trackingNumber: any;

  @ApiProperty()
  @Expose()
  shippingMethod: any;

  @ApiProperty()
  @Expose()
  totalAmount: any;

  @ApiProperty()
  @Expose()
  productCount: any;

  @ApiProperty()
  @Expose()
  paymentMethod: any;

  @ApiProperty()
  @Expose()
  tiktokOrderId: any;
}
