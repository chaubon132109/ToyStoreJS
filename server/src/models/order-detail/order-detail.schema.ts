import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `order-details`,
  collation: DEFAULT_COLLATION,
})
export class OrderDetail extends BaseModel {
  @Prop({
    type: String,
    required: false,
  })
  id: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    required: false,
  })
  orderId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Item',
    required: false,
  })
  itemId: Types.ObjectId;

  @Prop({
    type: Number,
    required: false,
    default: 1,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: false,
  })
  price: number;

  @Prop({
    type: Number,
    required: false,
  })
  discountPercent: number;

  @Prop({
    type: String,
    required: false,
  })
  tiktokOrderId: string;

  @Prop({
    type: String,
    required: false,
  })
  tiktokOrderStatus: string;
}
export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
