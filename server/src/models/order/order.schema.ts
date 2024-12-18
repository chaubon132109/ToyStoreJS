import { OrderStatus } from '@components/order/order.constant';
import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `orders`,
  collation: DEFAULT_COLLATION,
})
export class Order extends BaseModel {
  @Prop({
    type: String,
    required: false,
  })
  id: number;

  @Prop({
    type: String,
    required: false,
  })
  code: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Number,
    required: false,
    default: OrderStatus.AWAITING_SHIPMENT,
  })
  status: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'ShippingAddress',
    required: false,
  })
  shipingAddressId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'ShippingMethod',
    required: false,
  })
  shipingMethodId: Types.ObjectId;

  @Prop({
    type: Number,
    required: false,
  })
  shippingFee: number;

  @Prop({
    type: Date,
    required: false,
  })
  orderAt: Date;

  @Prop({
    type: Date,
    required: false,
  })
  completeAt: Date;

  @Prop({
    type: Number,
    required: false,
  })
  paymentMethod: number;

  @Prop({
    type: Number,
    required: false,
  })
  paymentStatus: number;

  @Prop({
    type: String,
    required: false,
  })
  tiktokOrderId: string;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  totalAmount: number;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  productCount: number;

  @Prop({
    type: Number,
    required: false,
  })
  tiktokOrderStatus: number;

  @Prop({
    type: String,
    required: false,
  })
  note: string;

  @Prop({
    type: String,
    required: false,
  })
  trackingNumber: string;

  @Prop({
    type: String,
    required: false,
  })
  shippingProvider: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
