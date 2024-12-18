import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `images`,
  collation: DEFAULT_COLLATION,
})
export class Image extends BaseModel {
  @Prop({
    type: String,
    required: false,
  })
  id: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Ỉtem',
    required: false,
  })
  itemId: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  url: string;
}
export const ImageSchema = SchemaFactory.createForClass(Image);
