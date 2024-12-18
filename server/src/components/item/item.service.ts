import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { ItemServiceInterface } from './interface/item.service.interface';
import { ItemRepositoryInterface } from './interface/item.repository.interface';

import { GetListItemRequestDto } from './dto/request/get-list-item.request.dto';
import { GetDetailItemRequestDto } from './dto/request/get-detail-item.request.dto';
import {
  CreateFormItemRequestDto,
  CreateItemRequestDto,
} from './dto/request/create-item.request.dto';
import { UpdateItemRequestDto } from './dto/request/update-item.request.dto';
import { DeleteItemRequestDto } from './dto/request/delete-item.request.dto';

import { GetListItemResponseDto } from './dto/response/get-list-item.response.dto';
import { GetDetailItemResponseDto } from './dto/response/get-detail-item.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';
import { TiktokServiceInterface } from '@components/tiktok/interface/tiktok.service.interface';
import { Types } from 'mongoose';
import { Item } from 'src/models/item/item.schema';
import { CreateProductRequestDto } from '@components/tiktok/dto/request/create-product-tiktok.request.dto';
import { ImageRepositoryInterface } from '@components/image/interface/image.repository.interface';
import { TiktokStatusEnum } from './item.constant';

@Injectable()
export class ItemService implements ItemServiceInterface {
  private readonly logger = new Logger(ItemService.name);

  constructor(
    @Inject('ItemRepositoryInterface')
    private readonly itemRepository: ItemRepositoryInterface,
    @Inject('ImageRepositoryInterface')
    private readonly imageRepository: ImageRepositoryInterface,
    @Inject('TiktokServiceInterface')
    private readonly tiktokService: TiktokServiceInterface,
  ) {}

  async create(request: CreateFormItemRequestDto): Promise<any> {
    const { item, images } = request;
    const imagesBase64 = images.map((image) => {
      return {
        filename: image.filename,
        base64: image.data.toString('base64'), // Chuyển Buffer thành chuỗi base64
      };
    });

    const imagesTiktok = [];
    const imageDocuments = [];
    for (let i = 0; i < imagesBase64.length; i++) {
      const image = imagesBase64[i];
      const response = await this.tiktokService.uploadImage(image.base64, 1);
      imagesTiktok.push(response.image?.data);
    }
    const syncTikTok = await this.createTikTokProduct({
      ...item,
      imageIds: map(imagesTiktok, 'img_id'),
    });
    item.tiktokId = syncTikTok.product?.data?.product_id;
    const itemDocument = this.itemRepository.createDocument(item);

    const newItem = await this.itemRepository.create(itemDocument);

    imagesTiktok.forEach((image) => {
      const imageDocument = this.imageRepository.createDocument({
        url: image.img_url,
        itemId: new Types.ObjectId(newItem._id),
      });
      imageDocuments.push(imageDocument);
    });
    await this.imageRepository.createMany(imageDocuments);

    return new ResponseBuilder(newItem)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListItemRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.itemRepository.getList(request);

    const response = plainToInstance(GetListItemResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getDetail(request: GetDetailItemRequestDto): Promise<any> {
    const item = await this.itemRepository.getDetail(request.id);
    // implement logic here
    if (isEmpty(item)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const response = plainToInstance(GetDetailItemResponseDto, item, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateItemRequestDto): Promise<any> {
    const { id } = request;
    const item = await this.itemRepository.findOneById(id);

    if (isEmpty(item)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newItemSchema = this.itemRepository.updateDocument(item, request);

    const itemUpdate = await this.itemRepository.findByIdAndUpdate(
      id,
      newItemSchema,
    );
    // implement logic here
    return new ResponseBuilder(itemUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteItemRequestDto): Promise<any> {
    const { id } = request;
    const item = await this.itemRepository.findOneById(id);

    if (isEmpty(item)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.itemRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getItemsByIds(ids: any): Promise<Item[]> {
    const items = await this.itemRepository.findAllByCondition({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    });
    return items;
  }

  async updateItems(items: Item[]): Promise<any> {
    const itemIds = map(items, 'id');
    const existingItems = await this.itemRepository.findAllByCondition({
      _id: { $in: itemIds.map((id) => new Types.ObjectId(id)) },
    });
    const existingItemsById = keyBy(existingItems, 'id');

    const updatedItems = map(items, (item) => {
      const existingItem = existingItemsById[item.id];
      if (!existingItem) {
        return item;
      }
      return {
        ...existingItem,
        ...item,
      };
    });

    return this.itemRepository.updateMany(updatedItems);
  }
  async createTikTokProduct(request: any): Promise<any> {
    //new api : /product/202309/products
    const requestTiktok = new CreateProductRequestDto();
    requestTiktok.images = request.imageIds.map((id) => {
      return {
        id: id,
      };
    }); //Chuyen thanh main_images [uri]
    requestTiktok.product_name = request.name; //titlr
    requestTiktok.skus = [
      {
        seller_sku: request.sku,
        stock_infos: [
          //inventory
          {
            available_stock: +request.stockQuantity, //quantity
            warehouse_id: '7429223446633236230',
          },
        ],
        original_price: request.price, //price
      } as any,
    ];
    requestTiktok.category_id = '700700';
    requestTiktok.category_version = 'v1';
    requestTiktok.description = request.description;
    //package_dimensions: {
    //   length: +request.length,
    //   width: +request.width,
    //   height: +request.height,
    //   unit: 'CENTIMETER'
    // }
    requestTiktok.package_length = +request.length;
    requestTiktok.package_width = +request.width;
    requestTiktok.package_height = +request.height;
    //package_weight: {
    //   value: +request.weight,
    //   unit: 'KILOGRAM'
    // }
    requestTiktok.package_weight = request.weight;
    requestTiktok.is_cod_open = true; //is_cod_allowed
    return await this.tiktokService.createTikTokProduct(requestTiktok);
  }

  async updateStatusTikTokProduct(request: any): Promise<any> {
    const { product_id, status } = request.data;
    let product = await this.itemRepository.findOneByCondition({
      tiktokId: product_id,
    });
    if (isEmpty(product)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    switch (status) {
      case 'PRODUCT_FIRST_PASS_REVIEW':
        product.tiktokProductStatus =
          TiktokStatusEnum.PRODUCT_FIRST_PASS_REVIEW;
        break;
      case 'PRODUCT_STATUS_CHANGED':
        product.tiktokProductStatus =
          product.tiktokProductStatus === TiktokStatusEnum.ACTIVE
            ? TiktokStatusEnum.INACTIVE
            : TiktokStatusEnum.ACTIVE;
        break;
      case 'PRODUCT_AUDIT_FAILURE':
        product.tiktokProductStatus = TiktokStatusEnum.PRODUCT_AUDIT_FAILURE;
        break;
      default:
        break;
    }
    await this.itemRepository.updateById(product._id, product);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getItemsByTiktokIds(ids: string[]): Promise<any> {
    return await this.itemRepository.findAllByCondition({
      tiktokId: { $in: ids },
    });
  }
  async bulkWrite(request: any): Promise<any> {
    return await this.itemRepository.bulkWrite(request);
  }
}
