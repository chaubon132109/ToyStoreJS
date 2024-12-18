import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `shippingAddresses`,
  collation: DEFAULT_COLLATION,
})
export class ShippingAddress extends BaseModel {
  @Prop({
    type: String,
    required: false,
  })
  id: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Number,
    required: false,
    default: 1,
  })
  status: number;

  @Prop({
    type: String,
    required: false,
  })
  address: string;

  @Prop({
    type: String,
    required: false,
  })
  name: string;

  @Prop({
    type: String,
    required: false,
  })
  phone: string;

  @Prop({
    type: Boolean,
    required: false,
  })
  isDefault: boolean;
}
export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);
