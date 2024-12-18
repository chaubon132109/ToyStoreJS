import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class OrderDetail {
  @ApiProperty()
  @IsOptional()
  cartId: string;

  @ApiProperty()
  @IsOptional()
  itemId: string;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  discount: number;
}

export class CreateOrderRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  shipingMethodId: string;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  shipingAddressId: string;

  @ApiProperty()
  @IsOptional()
  paymentMethod: number;

  @ApiProperty()
  @IsOptional()
  shippingFee: number;

  @ApiProperty()
  @IsOptional()
  totalAmount: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => OrderDetail)
  orderDetails: OrderDetail[];
}
