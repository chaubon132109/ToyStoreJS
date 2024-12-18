import { Injectable, Inject, Logger } from '@nestjs/common';
import { TiktokServiceInterface } from './interface/tiktok.service.interface';
import {
  fetchTiktokApiGet,
  fetchTiktokApiPost,
} from 'src/helper/tiktok.helper';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class TiktokService implements TiktokServiceInterface {
  private readonly logger = new Logger(TiktokService.name);
  private readonly accessToken =
    'ROW_nG-KwQAAAAAsD8eWtN4523oocsVFRttmddYheiXt7CZIHsbs7WE9Ctt7Me38gIBR-h-YsLMl2oqNoBbHmCfP85JElXp56VTMLzVEyb_bBMRYFaV51w5gHhjSnJvwTid6pUCDPDf1k_GGhMdeQ-bHdSNwTSV6ZcYNXxmJDn6niQmzlrAVKY9YaA';

  constructor() {}

  async getShopInfomation(request: any): Promise<any> {
    const shopInfo = await fetchTiktokApiGet(
      'https://open-api.tiktokglobalshop.com/api/shop/get_authorized_shop',
      this.accessToken,
    );
    return { shopInfo };
  }

  async getTikTokCategory(): Promise<any> {
    const category = await fetchTiktokApiGet(
      'https://open-api.tiktokglobalshop.com/api/products/categories',
      this.accessToken,
      {
        shop_cipher: process.env.TIKTOK_SHOP_CIPHER,
        shop_id: '7495969030309775897',
      },
    );
    return { category };
  }

  async getWareHouseList(): Promise<any> {
    const warehouses = await fetchTiktokApiGet(
      'https://open-api.tiktokglobalshop.com//api/logistics/get_warehouse_list',
      this.accessToken,
    );
  }

  async uploadImage(img_data: any, img_scene: any = 1): Promise<any> {
    const image = await fetchTiktokApiPost(
      'https://open-api.tiktokglobalshop.com/api/products/upload_imgs',
      this.accessToken,
      {},
      {
        img_data,
        img_scene,
      },
    );
    return { image };
  }

  async createTikTokProduct(request: any): Promise<any> {
    const product = await fetchTiktokApiPost(
      'https://open-api.tiktokglobalshop.com/api/products',
      this.accessToken,
      {},
      request,
    );
    return { product };
  }

  async getTiktokOrderDetail(orderId: string): Promise<any> {
    const orders = await fetchTiktokApiPost(
      `https://open-api.tiktokglobalshop.com/api/orders/detail/query`,
      this.accessToken,
      {
        shop_cipher: process.env.TIKTOK_SHOP_CIPHER,
      },
      {
        order_id_list: [orderId],
      },
    );
    return orders?.data?.order_list[0];
  }
}
