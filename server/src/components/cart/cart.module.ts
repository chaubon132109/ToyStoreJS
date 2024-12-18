import { Module } from '@nestjs/common';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from 'src/mongo/repository/cart/cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from 'src/models/cart/cart.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@components/user/user.service';
import { UserModule } from '@components/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    UserModule,
  ],
  providers: [
    JwtService,
    {
      provide: 'CartServiceInterface',
      useClass: CartService,
    },
    {
      provide: 'CartRepositoryInterface',
      useClass: CartRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: 'CartServiceInterface',
      useClass: CartService,
    },
  ],
  controllers: [CartController],
})
export class CartModule {}
