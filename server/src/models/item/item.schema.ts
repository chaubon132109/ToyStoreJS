import { TiktokStatusEnum } from '@components/item/item.constant';
import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `items`,
  collation: DEFAULT_COLLATION,
})
export class Item extends BaseModel {
  @Prop({
    type: String,
    required: false,
  })
  id: string;

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
    type: String,
    required: false,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  categoryId: Types.ObjectId;

  @Prop({
    type: Number,
    required: false,
  })
  length: number;

  @Prop({
    type: Number,
    required: false,
  })
  width: number;

  @Prop({
    type: Number,
    required: false,
  })
  height: number;

  @Prop({
    type: Number,
    required: false,
  })
  weight: number;

  @Prop({
    type: String,
    required: false,
  })
  gender: string;

  @Prop({
    type: Number,
    required: false,
  })
  age: number;

  @Prop({
    type: String,
    required: false,
  })
  sku: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isTiktokProduct: boolean;

  @Prop({
    type: String,
    required: false,
  })
  tiktokId: string;

  @Prop({
    type: Number,
    required: false,
    default: TiktokStatusEnum.CREATED,
  })
  tiktokProductStatus: number;

  @Prop({
    type: Number,
    required: false,
  })
  price: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Discount',
    required: false,
  })
  discountId: Types.ObjectId;

  @Prop({
    type: Number,
    required: false,
  })
  stockQuantity: number;

  @Prop({
    type: Number,
    required: false,
  })
  sold: number;
}
export const ItemSchema = SchemaFactory.createForClass(Item);
