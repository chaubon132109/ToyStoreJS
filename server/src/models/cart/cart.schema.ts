import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `carts`,
  collation: DEFAULT_COLLATION,
})
export class Cart extends BaseModel {
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
}
export const CartSchema = SchemaFactory.createForClass(Cart);
