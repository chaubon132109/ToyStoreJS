import { Module } from '@nestjs/common';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from 'src/mongo/repository/order/order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/models/order/order.schema';
import { OrderDetailRepository } from 'src/mongo/repository/order-detail/order-detail.repository';
import { OrderDetailSchema } from 'src/models/order-detail/order-detail.schema';
import { CartSchema } from 'src/models/cart/cart.schema';
import { CartRepository } from 'src/mongo/repository/cart/cart.repository';
import { ItemRepository } from 'src/mongo/repository/item/item.repository';
import { ItemService } from '@components/item/item.service';
import { TiktokService } from '@components/tiktok/tikltok.service';
import { ImageRepository } from 'src/mongo/repository/image/image.repository';
import { ImageSchema } from 'src/models/image/image.schema';
import { ShippingMethodRepository } from 'src/mongo/repository/shipping-method/shipping-method.repository';
import { ShippingMethod } from 'src/models/shipping-method/shipping-method.schema';
import { UserService } from '@components/user/user.service';
import { ShippingAddressRepository } from 'src/mongo/repository/shipping-address/shipping-address.repository';
import { UserRepository } from 'src/mongo/repository/user/user.repository';
import { UserSchema } from 'src/models/user/user.schema';
import { ShippingAddress } from 'src/models/shipping-address/shipping-address.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderDetail', schema: OrderDetailSchema },
      { name: 'Image', schema: ImageSchema },
      {
        name: 'Cart',
        schema: CartSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'ShippingMethod',
        schema: ShippingMethod,
      },
      {
        name: 'ShippingAddress',
        schema: ShippingAddress,
      },
    ]),
  ],
  providers: [
    JwtService,
    {
      provide: 'OrderServiceInterface',
      useClass: OrderService,
    },
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: 'OrderDetailRepositoryInterface',
      useClass: OrderDetailRepository,
    },
    {
      provide: 'CartRepositoryInterface',
      useClass: CartRepository,
    },
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
    {
      provide: 'ImageRepositoryInterface',
      useClass: ImageRepository,
    },
    {
      provide: 'TiktokServiceInterface',
      useClass: TiktokService,
    },
    {
      provide: 'ShippingMethodRepositoryInterface',
      useClass: ShippingMethodRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'ShippingAddressRepositoryInterface',
      useClass: ShippingAddressRepository,
    },
  ],
  exports: [
    {
      provide: 'OrderServiceInterface',
      useClass: OrderService,
    },
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: 'OrderDetailRepositoryInterface',
      useClass: OrderDetailRepository,
    },
    {
      provide: 'CartRepositoryInterface',
      useClass: CartRepository,
    },
    {
      provide: 'ImageRepositoryInterface',
      useClass: ImageRepository,
    },
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
    {
      provide: 'TiktokServiceInterface',
      useClass: TiktokService,
    },
    {
      provide: 'ShippingMethodRepositoryInterface',
      useClass: ShippingMethodRepository,
    },
    {
      provide: 'ShippingAddressRepositoryInterface',
      useClass: ShippingAddressRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
