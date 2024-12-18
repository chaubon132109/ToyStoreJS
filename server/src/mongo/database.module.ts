import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user/user.schema';
import { UserRepository } from './repository/user/user.repository';
import { ItemRepository } from 'src/mongo/repository/item/item.repository';
import { ItemSchema } from 'src/models/item/item.schema';
import { CategorySchema } from 'src/models/category/category.schema';
import { DiscountSchema } from 'src/models/discount/discount.schema';
import { ShippingMethodSchema } from 'src/models/shipping-method/shipping-method.schema';
import { ShippingAddressSchema } from 'src/models/shipping-address/shipping-address.schema';
import { CartSchema } from 'src/models/cart/cart.schema';
import { OrderSchema } from 'src/models/order/order.schema';
import { OrderDetailSchema } from 'src/models/order-detail/order-detail.schema';
import mongoose from 'mongoose';
import { CommentSchema } from 'src/models/comment/comment.schema';
import { PaymentSchema } from 'src/models/payment/payment.schema';
@Global()
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:chaubon21@tour.etqmytu.mongodb.net/ecommerce-web?retryWrites=true&w=majority&appName=Tour',
    ),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Item',
        schema: ItemSchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
      {
        name: 'Discount',
        schema: DiscountSchema,
      },
      {
        name: 'ShippingMethod',
        schema: ShippingMethodSchema,
      },
      {
        name: 'ShippingAddress',
        schema: ShippingAddressSchema,
      },
      {
        name: 'Cart',
        schema: CartSchema,
      },
      {
        name: 'Order',
        schema: OrderSchema,
      },
      {
        name: 'OrderDetail',
        schema: OrderDetailSchema,
      },
      {
        name: 'Comment',
        schema: CommentSchema,
      },
      {
        name: 'Payment',
        schema: PaymentSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
  ],
  exports: [
    {
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
  ],
})
export class DatabaseModule {
  constructor() {
    mongoose.set('debug', true); // Bật log truy vấn MongoDB
  }
}
