import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `discounts`,
  collation: DEFAULT_COLLATION,
})
export class Discount extends BaseModel {
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
    type: Number,
    required: false,
  })
  percent: number;

  @Prop({
    type: Date,
    required: false,
  })
  startApply: Date;

  @Prop({
    type: Date,
    required: false,
  })
  endApply: Date;
}
export const DiscountSchema = SchemaFactory.createForClass(Discount);
