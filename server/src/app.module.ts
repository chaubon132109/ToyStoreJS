import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@components/user/user.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@core/pipe/validator.pipe';
import { DatabaseModule } from './mongo/database.module';
import { AuthModule } from '@components/auth/auth.module';
import { AuthGuard } from '@core/guards/authorization.guard';
import { JwtModule } from '@nestjs/jwt';
import { ItemModule } from '@components/item/item.module';
import { CategoryModule } from '@components/category/category.module';
import { DiscountModule } from '@components/discount/discount.module';
import { TiktokModule } from '@components/tiktok/titok.module';
import { ShippingMethodModule } from '@components/shipping-method/shipping-method.module';
import { ShippingAddress } from './models/shipping-address/shipping-address.schema';
import { ShippingAddressModule } from '@components/shipping-address/shipping-address.module';
import { CartModule } from '@components/cart/cart.module';
import { OrderSchema } from './models/order/order.schema';
import { OrderModule } from '@components/order/order.module';
import { OrderDetailModule } from '@components/order-detail/order-detail.module';
import { CommentModule } from '@components/comment/comment.module';
import { Payment } from './models/payment/payment.schema';
import { PaymentModule } from '@components/payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '@constant/configuration';
import { BullModule } from '@nestjs/bull';
import { TikTokQueueModule } from '@components/webhook/webhook.module';
import { QueueService } from '@components/webhook/queue.service';
import { ReportControllerModule } from '@components/report/report.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'pz8An9L9uZ4W8UOyg3HTFlS8RBlLZjGwMLrSgTiVbDQ', // Replace with a secure key
      signOptions: { expiresIn: '100d' }, // Configure options as needed
    }),
    BullModule.registerQueue({
      name: 'tiktok-webhook',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ItemModule,
    CategoryModule,
    DiscountModule,
    TiktokModule,
    ShippingMethodModule,
    ShippingAddressModule,
    CartModule,
    OrderModule,
    OrderDetailModule,
    CommentModule,
    PaymentModule,
    ItemModule,
    TikTokQueueModule,
    ReportControllerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
    QueueService,
  ],
})
export class AppModule {}
