import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `categories`,
  collation: DEFAULT_COLLATION,
})
export class Category extends BaseModel {
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
    default: 0,
  })
  status: number;

  @Prop({
    type: String,
    required: false,
  })
  description: string;

  @Prop({
    type: String,
    required: false,
    default: 'server',
  })
  source: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
