import { Module } from '@nestjs/common';

import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountRepository } from 'src/mongo/repository/discount/discount.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountSchema } from 'src/models/discount/discount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Discount', schema: DiscountSchema }]),
  ],
  providers: [
    {
      provide: 'DiscountServiceInterface',
      useClass: DiscountService,
    },
    {
      provide: 'DiscountRepositoryInterface',
      useClass: DiscountRepository,
    },
  ],
  exports: [
    {
      provide: 'DiscountServiceInterface',
      useClass: DiscountService,
    },
  ],
  controllers: [DiscountController],
})
export class DiscountModule {}
