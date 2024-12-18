import { Module } from '@nestjs/common';

import { ShippingAddressController } from './shipping-address.controller';
import { ShippingAddressService } from './shipping-address.service';
import { ShippingAddressRepository } from 'src/mongo/repository/shipping-address/shipping-address.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingAddressSchema } from 'src/models/shipping-address/shipping-address.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ShippingAddress', schema: ShippingAddressSchema },
    ]),
  ],
  providers: [
    {
      provide: 'ShippingAddressServiceInterface',
      useClass: ShippingAddressService,
    },
    {
      provide: 'ShippingAddressRepositoryInterface',
      useClass: ShippingAddressRepository,
    },
    JwtService,
  ],
  exports: [
    {
      provide: 'ShippingAddressServiceInterface',
      useClass: ShippingAddressService,
    },
  ],
  controllers: [ShippingAddressController],
})
export class ShippingAddressModule {}
