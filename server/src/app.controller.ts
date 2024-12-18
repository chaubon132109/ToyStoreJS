import {
  Controller,
  Get,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { WEBHOOK_TYPE } from '@constant/common';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import * as JSONbig from 'json-bigint';
import { OrderServiceInterface } from '@components/order/interface/order.service.interface';
import { TikTokQueueService } from '@components/webhook/tiktok-queue.service';
import { QueueService } from '@components/webhook/queue.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('OrderServiceInterface')
    private readonly orderService: OrderServiceInterface,

    private readonly queueService: QueueService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('webhook')
  async handleTikTokWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const JSONbigString = JSONbig({ storeAsString: true });
    const payload = JSONbigString.parse(req.rawBody.toString());
    console.log('🚀 ~ AppController ~ payload:', payload);
    try {
      await this.queueService.addJob(payload);
      return res.status(200).send('Success');
    } catch (error) {
      console.error('Error handling TikTok webhook:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
