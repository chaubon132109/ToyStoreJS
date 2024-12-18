import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TikTokQueueProcessor } from './tiktok-queue.processor';
import { TikTokQueueService } from './tiktok-queue.service';
import { OrderModule } from '@components/order/order.module';
import { ItemModule } from '@components/item/item.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tiktok-webhook',
    }),
    ItemModule,
    OrderModule,
  ],
  providers: [TikTokQueueProcessor, TikTokQueueService],
  exports: [TikTokQueueService],
})
export class TikTokQueueModule {}
