import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `comments`,
  collation: DEFAULT_COLLATION,
})
export class Comment extends BaseModel {
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
    type: Types.ObjectId,
    ref: 'Item',
    required: false,
  })
  itemId: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  content: string;

  @Prop({
    type: Number,
    required: false,
    default: 1,
  })
  status: number;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
