import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `shippingMethods`,
  collation: DEFAULT_COLLATION,
})
export class ShippingMethod extends BaseModel {
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
    type: String,
    required: false,
  })
  name: string;

  @Prop({
    type: String,
    required: false,
  })
  nameEn: string;

  @Prop({
    type: Number,
    required: false,
    default: 1,
  })
  status: number;

  @Prop({
    type: Number,
    required: false,
  })
  fee: number;

  @Prop({
    type: String,
    required: false,
  })
  description: string;
}
export const ShippingMethodSchema =
  SchemaFactory.createForClass(ShippingMethod);
