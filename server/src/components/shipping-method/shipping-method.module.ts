import { Module } from '@nestjs/common';

import { ShippingMethodController } from './shipping-method.controller';
import { ShippingMethodService } from './shipping-method.service';
import { ShippingMethodRepository } from 'src/mongo/repository/shipping-method/shipping-method.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingMethodSchema } from 'src/models/shipping-method/shipping-method.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ShippingMethod', schema: ShippingMethodSchema },
    ]),
  ],
  providers: [
    {
      provide: 'ShippingMethodServiceInterface',
      useClass: ShippingMethodService,
    },
    {
      provide: 'ShippingMethodRepositoryInterface',
      useClass: ShippingMethodRepository,
    },
  ],
  exports: [
    {
      provide: 'ShippingMethodServiceInterface',
      useClass: ShippingMethodService,
    },
  ],
  controllers: [ShippingMethodController],
})
export class ShippingMethodModule {}
