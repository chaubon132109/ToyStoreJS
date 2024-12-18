import { DEFAULT_COLLATION, SALT_ROUNDS, StatusEnum } from '@constant/common';
import { BaseModel } from '@core/model/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { USER_ROLE } from '@components/user/user.constant';
import { ShippingAddress } from '../shipping-address/shipping-address.schema';

// Constants

@Schema({
  timestamps: true,
  collection: 'users',
  collation: DEFAULT_COLLATION,
})
export class User extends BaseModel {
  @Prop({ type: String, required: false })
  id: number;

  @Prop({ type: String, required: false })
  code: string;

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false })
  nameEn: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({
    type: String,
    required: true,
    select: false, // Don't return password by default
  })
  password: string;

  @Prop({ type: Number, required: false, default: USER_ROLE.USER })
  role: number;

  @Prop({ type: Number, required: false, default: StatusEnum.ACTIVE })
  status: number;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  dob: Date;

  @Prop({ type: String, required: false })
  email: string;

  @Prop({ type: String, required: false })
  phone: string;

  @Prop({ type: String, required: false })
  gender: string;

  /**
   * Compare the provided password with the stored hashed password.
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save middleware to hash password before saving
UserSchema.pre<HydratedDocument<User>>('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is unchanged

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
