import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TikTokQueueService {
  constructor(@InjectQueue('tiktok-webhook') private readonly queue: Queue) {}

  async addJob(payload: any) {
    await this.queue.add(payload, {
      attempts: 3,
      backoff: 5000,
    });
  }
}
