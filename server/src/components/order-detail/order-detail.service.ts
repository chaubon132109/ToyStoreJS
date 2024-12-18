

import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { OrderDetailServiceInterface } from './interface/order-detail.service.interface';
import { OrderDetailRepositoryInterface } from './interface/order-detail.repository.interface';

import { GetListOrderDetailRequestDto } from './dto/request/get-list-order-detail.request.dto';
import { GetDetailOrderDetailRequestDto } from './dto/request/get-detail-order-detail.request.dto';
import { CreateOrderDetailRequestDto } from './dto/request/create-order-detail.request.dto';
import { UpdateOrderDetailRequestDto } from './dto/request/update-order-detail.request.dto';
import { DeleteOrderDetailRequestDto } from './dto/request/delete-order-detail.request.dto';

import { GetListOrderDetailResponseDto } from './dto/response/get-list-order-detail.response.dto';
import { GetDetailOrderDetailResponseDto } from './dto/response/get-detail-order-detail.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';


@Injectable()
export class OrderDetailService implements OrderDetailServiceInterface{
  private readonly logger = new Logger(OrderDetailService.name);

  constructor(
    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,


  ) {}

  async create(request: CreateOrderDetailRequestDto): Promise<any> {
    const orderDetailDocument = this.orderDetailRepository.createDocument(request);

    const orderDetail = await this.orderDetailRepository.create(orderDetailDocument);

    return new ResponseBuilder(orderDetail)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListOrderDetailRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.orderDetailRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListOrderDetailResponseDto, data, {
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

  async getDetail(request: GetDetailOrderDetailRequestDto): Promise<any> {
    const orderDetail = await this.orderDetailRepository.getDetail(request);

    // implement logic here

    if (isEmpty(orderDetail)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }


     const response = plainToInstance(
      GetDetailOrderDetailResponseDto,
       orderDetail, 
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateOrderDetailRequestDto): Promise<any> {
    const { id } = request;
    const orderDetail = await this.orderDetailRepository.findOneById(id);

    if (isEmpty(orderDetail)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newOrderDetailSchema = this.orderDetailRepository.updateDocument(orderDetail, request);

    const orderDetailUpdate = await this.orderDetailRepository.findByIdAndUpdate(id, newOrderDetailSchema);
    // implement logic here
    return new ResponseBuilder(orderDetailUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteOrderDetailRequestDto): Promise<any> {
    const { id } = request;
    const orderDetail = await this.orderDetailRepository.findOneById(id);

    if (isEmpty(orderDetail)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.orderDetailRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
