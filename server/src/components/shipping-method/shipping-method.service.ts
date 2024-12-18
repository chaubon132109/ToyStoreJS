

import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { ShippingMethodServiceInterface } from './interface/shipping-method.service.interface';
import { ShippingMethodRepositoryInterface } from './interface/shipping-method.repository.interface';

import { GetListShippingMethodRequestDto } from './dto/request/get-list-shipping-method.request.dto';
import { GetDetailShippingMethodRequestDto } from './dto/request/get-detail-shipping-method.request.dto';
import { CreateShippingMethodRequestDto } from './dto/request/create-shipping-method.request.dto';
import { UpdateShippingMethodRequestDto } from './dto/request/update-shipping-method.request.dto';
import { DeleteShippingMethodRequestDto } from './dto/request/delete-shipping-method.request.dto';

import { GetListShippingMethodResponseDto } from './dto/response/get-list-shipping-method.response.dto';
import { GetDetailShippingMethodResponseDto } from './dto/response/get-detail-shipping-method.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';


@Injectable()
export class ShippingMethodService implements ShippingMethodServiceInterface{
  private readonly logger = new Logger(ShippingMethodService.name);

  constructor(
    @Inject('ShippingMethodRepositoryInterface')
    private readonly shippingMethodRepository: ShippingMethodRepositoryInterface,


  ) {}

  async create(request: CreateShippingMethodRequestDto): Promise<any> {
    const shippingMethodDocument = this.shippingMethodRepository.createDocument(request);

    const shippingMethod = await this.shippingMethodRepository.create(shippingMethodDocument);

    return new ResponseBuilder(shippingMethod)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListShippingMethodRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.shippingMethodRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListShippingMethodResponseDto, data, {
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

  async getDetail(request: GetDetailShippingMethodRequestDto): Promise<any> {
    const shippingMethod = await this.shippingMethodRepository.getDetail(request);

    // implement logic here

    if (isEmpty(shippingMethod)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }


     const response = plainToInstance(
      GetDetailShippingMethodResponseDto,
       shippingMethod, 
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateShippingMethodRequestDto): Promise<any> {
    const { id } = request;
    const shippingMethod = await this.shippingMethodRepository.findOneById(id);

    if (isEmpty(shippingMethod)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newShippingMethodSchema = this.shippingMethodRepository.updateDocument(shippingMethod, request);

    const shippingMethodUpdate = await this.shippingMethodRepository.findByIdAndUpdate(id, newShippingMethodSchema);
    // implement logic here
    return new ResponseBuilder(shippingMethodUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteShippingMethodRequestDto): Promise<any> {
    const { id } = request;
    const shippingMethod = await this.shippingMethodRepository.findOneById(id);

    if (isEmpty(shippingMethod)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.shippingMethodRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
