import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { OrderServiceInterface } from '@components/order/interface/order.service.interface';
import { WEBHOOK_TYPE } from '@constant/common';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  constructor(
    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('OrderServiceInterface')
    private readonly orderService: OrderServiceInterface,
  ) {}
  private queue: Array<{ payload: any; resolve: Function; reject: Function }> =
    [];
  private isProcessing = false;

  async addJob(payload: any) {
    return new Promise((resolve, reject) => {
      this.queue.push({ payload, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const job = this.queue.shift();

    try {
      // Xử lý job
      await this.handleJob(job.payload);
      job.resolve('Success');
    } catch (error) {
      job.reject(error);
    } finally {
      this.isProcessing = false;
      this.processQueue(); // Xử lý job tiếp theo
    }
  }

  private async handleJob(payload: any) {
    // Logic xử lý payload

    switch (payload.type) {
      case WEBHOOK_TYPE.ORDER_STARUS_CHANGED:
        const response = await this.orderService.updateTiktokOrder(payload);
        break;
      case WEBHOOK_TYPE.PRODUCT_STATUS_CHANGED:
        await this.itemService.updateStatusTikTokProduct(payload);
      default:
        console.log('Unhandled payload type:', payload.type);
        break;
    }
  }
}
