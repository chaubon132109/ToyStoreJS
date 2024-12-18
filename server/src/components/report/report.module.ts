import { Module } from '@nestjs/common';

import { ShippingAddressRepository } from 'src/mongo/repository/shipping-address/shipping-address.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingAddressSchema } from 'src/models/shipping-address/shipping-address.schema';
import { JwtService } from '@nestjs/jwt';
import { OrderSchema } from 'src/models/order/order.schema';
import { OrderRepository } from 'src/mongo/repository/order/order.repository';
import { ItemSchema } from 'src/models/item/item.schema';
import { ItemRepository } from 'src/mongo/repository/item/item.repository';
import { UserSchema } from 'src/models/user/user.schema';
import { UserRepository } from 'src/mongo/repository/user/user.repository';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { OrderDetailSchema } from 'src/models/order-detail/order-detail.schema';
import { OrderDetailRepository } from 'src/mongo/repository/order-detail/order-detail.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderDetail', schema: OrderDetailSchema },
      { name: 'Item', schema: ItemSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [
    JwtService,
    {
      provide: 'ReportServiceInterface',
      useClass: ReportService,
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
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  exports: [],
  controllers: [ReportController],
})
export class ReportControllerModule {}
