import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Injectable } from '@nestjs/common';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { OrderServiceInterface } from '@components/order/interface/order.service.interface';
import { WEBHOOK_TYPE } from '@constant/common';

@Processor('tiktok-webhook')
export class TikTokQueueProcessor {
  constructor(
    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('OrderServiceInterface')
    private readonly orderService: OrderServiceInterface,
  ) {}
  @Process() // Mặc định xử lý tất cả các job
  async handleTikTokJob(job: Job) {
    console.log(`Processing job: ${job.id}, Data:`, job.data);

    const payload = job.data;
    switch (payload.type) {
      case WEBHOOK_TYPE.ORDER_STARUS_CHANGED:
        const response = await this.orderService.updateTiktokOrder(payload);
        break;
      case WEBHOOK_TYPE.PRODUCT_STATUS_CHANGED:
        await this.itemService.updateStatusTikTokProduct(payload);
        break;
      default:
        break;
    }
  }
}
