import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance, Type } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { ShippingAddressServiceInterface } from './interface/shipping-address.service.interface';
import { ShippingAddressRepositoryInterface } from './interface/shipping-address.repository.interface';

import { GetListShippingAddressRequestDto } from './dto/request/get-list-shipping-address.request.dto';
import { GetDetailShippingAddressRequestDto } from './dto/request/get-detail-shipping-address.request.dto';
import { CreateShippingAddressRequestDto } from './dto/request/create-shipping-address.request.dto';
import { UpdateShippingAddressRequestDto } from './dto/request/update-shipping-address.request.dto';
import { DeleteShippingAddressRequestDto } from './dto/request/delete-shipping-address.request.dto';

import { GetListShippingAddressResponseDto } from './dto/response/get-list-shipping-address.response.dto';
import { GetDetailShippingAddressResponseDto } from './dto/response/get-detail-shipping-address.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';
import { GetDefaultShippingAddressRequestDto } from './dto/request/get-default-shiping-address.request.dto';
import { Types } from 'mongoose';

@Injectable()
export class ShippingAddressService implements ShippingAddressServiceInterface {
  private readonly logger = new Logger(ShippingAddressService.name);

  constructor(
    @Inject('ShippingAddressRepositoryInterface')
    private readonly shippingAddressRepository: ShippingAddressRepositoryInterface,
  ) {}

  async create(request: CreateShippingAddressRequestDto): Promise<any> {
    const { userId } = request;
    const defaultShippingAddress =
      await this.shippingAddressRepository.findOneByCondition({
        isDefault: true,
        userId: new Types.ObjectId(userId),
      });
    request.isDefault = defaultShippingAddress ? false : true;
    const shippingAddressDocument =
      this.shippingAddressRepository.createDocument(request);

    const shippingAddress = await this.shippingAddressRepository.create(
      shippingAddressDocument,
    );

    return new ResponseBuilder(shippingAddress)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListShippingAddressRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.shippingAddressRepository.getList(
      request,
    );

    // implement logic here

    const response = plainToInstance(GetListShippingAddressResponseDto, data, {
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

  async getDetail(request: GetDetailShippingAddressRequestDto): Promise<any> {
    const shippingAddress = await this.shippingAddressRepository.getDetail(
      request,
    );

    // implement logic here

    if (isEmpty(shippingAddress)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    const response = plainToInstance(
      GetDetailShippingAddressResponseDto,
      shippingAddress,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateShippingAddressRequestDto): Promise<any> {
    const { id } = request;
    const shippingAddress = await this.shippingAddressRepository.findOneById(
      id,
    );

    if (isEmpty(shippingAddress)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newShippingAddressSchema =
      this.shippingAddressRepository.updateDocument(shippingAddress, request);

    const shippingAddressUpdate =
      await this.shippingAddressRepository.findByIdAndUpdate(
        id,
        newShippingAddressSchema,
      );
    // implement logic here
    return new ResponseBuilder(shippingAddressUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteShippingAddressRequestDto): Promise<any> {
    const { id } = request;
    const shippingAddress = await this.shippingAddressRepository.findOneById(
      id,
    );

    if (isEmpty(shippingAddress)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.shippingAddressRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
  async getDefaultShippingAddress(
    request: GetDefaultShippingAddressRequestDto,
  ): Promise<any> {
    const { userId } = request;
    const shippingAddress =
      await this.shippingAddressRepository.findOneByCondition({
        isDefault: true,
        userId: new Types.ObjectId(userId),
      });
    return new ResponseBuilder(shippingAddress)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
  async getAddressByUserId(userId: string): Promise<any> {
    const shippingAddress =
      await this.shippingAddressRepository.findAllByCondition({
        userId: new Types.ObjectId(userId),
      });
    return new ResponseBuilder(shippingAddress)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
