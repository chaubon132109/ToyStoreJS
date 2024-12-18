import { Module } from '@nestjs/common';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from 'src/mongo/repository/payment/payment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from 'src/models/payment/payment.schema';
import { JwtService } from '@nestjs/jwt';
import { OrderService } from '@components/order/order.service';
import { OrderModule } from '@components/order/order.module';
import { ShippingMethod } from 'src/models/shipping-method/shipping-method.schema';
import { ShippingAddress } from 'src/models/shipping-address/shipping-address.schema';
import { OrderSchema } from 'src/models/order/order.schema';
import { OrderDetailSchema } from 'src/models/order-detail/order-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema },
      {
        name: 'ShippingMethod',
        schema: ShippingMethod,
      },
      {
        name: 'ShippingAddress',
        schema: ShippingAddress,
      },
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderDetail', schema: OrderDetailSchema },
    ]),
    OrderModule,
  ],
  providers: [
    JwtService,
    {
      provide: 'PaymentServiceInterface',
      useClass: PaymentService,
    },
    {
      provide: 'PaymentRepositoryInterface',
      useClass: PaymentRepository,
    },
    {
      provide: 'OrderServiceInterface',
      useClass: OrderService,
    },
  ],
  exports: [
    {
      provide: 'PaymentServiceInterface',
      useClass: PaymentService,
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
