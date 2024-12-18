import { DEFAULT_COLLATION } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: `payments`,
  collation: DEFAULT_COLLATION,
})
export class Payment extends BaseModel {
  @Prop({
    type: String,
    required: false,
  })
  amount: string;

  @Prop({
    type: String,
    required: false,
  })
  bankCode: string;

  @Prop({
    type: String,
    required: false,
  })
  bankTranNo: string;

  @Prop({
    type: String,
    required: false,
  })
  cardType: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    required: false,
  })
  orderId: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
  })
  txnRef: string;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
