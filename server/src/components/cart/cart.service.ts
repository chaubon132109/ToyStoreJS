import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { CartServiceInterface } from './interface/cart.service.interface';
import { CartRepositoryInterface } from './interface/cart.repository.interface';

import { GetListCartRequestDto } from './dto/request/get-list-cart.request.dto';
import { GetDetailCartRequestDto } from './dto/request/get-detail-cart.request.dto';
import { CreateCartRequestDto } from './dto/request/create-cart.request.dto';
import { UpdateCartRequestDto } from './dto/request/update-cart.request.dto';
import { DeleteCartRequestDto } from './dto/request/delete-cart.request.dto';

import { GetListCartResponseDto } from './dto/response/get-list-cart.response.dto';
import { GetDetailCartResponseDto } from './dto/response/get-detail-cart.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';
import { UpdateCartQuantityRequestDto } from './dto/request/update-cart-quantity.request.dto';
import { getListCartByIdsRequestDto } from './dto/request/get-list-cart-by-ids.request.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { Types } from 'mongoose';

@Injectable()
export class CartService implements CartServiceInterface {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @Inject('CartRepositoryInterface')
    private readonly cartRepository: CartRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  async create(request: CreateCartRequestDto): Promise<any> {
    const cartDocument = this.cartRepository.createDocument(request);

    const cart = await this.cartRepository.create(cartDocument);

    return new ResponseBuilder(cart)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListCartRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.cartRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListCartResponseDto, data, {
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

  async getDetail(request: GetDetailCartRequestDto): Promise<any> {
    const cart = await this.cartRepository.getDetail(request);

    // implement logic here

    if (isEmpty(cart)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    const response = plainToInstance(GetDetailCartResponseDto, cart, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateCartRequestDto): Promise<any> {
    const { id } = request;
    const cart = await this.cartRepository.findOneById(id);

    if (isEmpty(cart)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newCartSchema = this.cartRepository.updateDocument(cart, request);

    const cartUpdate = await this.cartRepository.findByIdAndUpdate(
      id,
      newCartSchema,
    );
    // implement logic here
    return new ResponseBuilder(cartUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteCartRequestDto): Promise<any> {
    const { id } = request;
    const cart = await this.cartRepository.findOneById(id);

    if (isEmpty(cart)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.cartRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async addToCart(request: CreateCartRequestDto): Promise<any> {
    const { itemId, userId, quantity } = request;
    const itemExists = await this.cartRepository.findOne({
      itemId: new Types.ObjectId(itemId),
      userId: new Types.ObjectId(userId),
    });
    if (itemExists) {
      const updateCart = await this.cartRepository.findOneAndUpdate(
        {
          itemId: new Types.ObjectId(itemId),
          userId: new Types.ObjectId(userId),
        },
        { quantity: itemExists.quantity + quantity },
      );
      return new ResponseBuilder(updateCart)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('error.SUCCESS')
        .build();
    }

    const cartDocument = this.cartRepository.createDocument(request);

    const cart = await this.cartRepository.create(cartDocument);

    return new ResponseBuilder(cart)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getListCartByUserId(request: GetListCartRequestDto): Promise<any> {
    const { data, count } = await this.cartRepository.getListCartByUser(
      request,
    );

    return new ResponseBuilder<PagingResponse>({
      items: data,
      meta: { total: count, page: 1 },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async updateCart(request: UpdateCartQuantityRequestDto): Promise<any> {
    const { cartId, quantity } = request;
    const cart = await this.cartRepository.findOneById(cartId);
    if (isEmpty(cart)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    if (quantity === 0) {
      await this.cartRepository.deleteById(cartId);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newCart = await this.cartRepository.updateCartQuatity(
      cartId,
      quantity,
    );
    return new ResponseBuilder(newCart)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
  async getCartDetailByIds(request: getListCartByIdsRequestDto): Promise<any> {
    const ids = request.ids.split(',');
    const { data, count } = await this.cartRepository.getListCartByIds(ids);
    const user = await this.userService.getDetail({
      id: request.userId,
    } as any);

    const dataUser = user.data;
    return new ResponseBuilder<PagingResponse>({
      items: {
        data,
        user: dataUser,
      },
      meta: { total: count, page: 1 },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
