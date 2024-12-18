import { Module } from '@nestjs/common';

import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { OrderDetailRepository } from 'src/mongo/repository/order-detail/order-detail.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailSchema } from 'src/models/order-detail/order-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OrderDetail', schema: OrderDetailSchema },
    ]),
  ],
  providers: [
    {
      provide: 'OrderDetailServiceInterface',
      useClass: OrderDetailService,
    },
    {
      provide: 'OrderDetailRepositoryInterface',
      useClass: OrderDetailRepository,
    },
  ],
  exports: [
    {
      provide: 'OrderDetailServiceInterface',
      useClass: OrderDetailService,
    },
  ],
  controllers: [OrderDetailController],
})
export class OrderDetailModule {}
