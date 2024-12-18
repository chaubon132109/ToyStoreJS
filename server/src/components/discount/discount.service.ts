

import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { DiscountServiceInterface } from './interface/discount.service.interface';
import { DiscountRepositoryInterface } from './interface/discount.repository.interface';

import { GetListDiscountRequestDto } from './dto/request/get-list-discount.request.dto';
import { GetDetailDiscountRequestDto } from './dto/request/get-detail-discount.request.dto';
import { CreateDiscountRequestDto } from './dto/request/create-discount.request.dto';
import { UpdateDiscountRequestDto } from './dto/request/update-discount.request.dto';
import { DeleteDiscountRequestDto } from './dto/request/delete-discount.request.dto';

import { GetListDiscountResponseDto } from './dto/response/get-list-discount.response.dto';
import { GetDetailDiscountResponseDto } from './dto/response/get-detail-discount.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';


@Injectable()
export class DiscountService implements DiscountServiceInterface{
  private readonly logger = new Logger(DiscountService.name);

  constructor(
    @Inject('DiscountRepositoryInterface')
    private readonly discountRepository: DiscountRepositoryInterface,


  ) {}

  async create(request: CreateDiscountRequestDto): Promise<any> {
    const discountDocument = this.discountRepository.createDocument(request);

    const discount = await this.discountRepository.create(discountDocument);

    return new ResponseBuilder(discount)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListDiscountRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.discountRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListDiscountResponseDto, data, {
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

  async getDetail(request: GetDetailDiscountRequestDto): Promise<any> {
    const discount = await this.discountRepository.getDetail(request);

    // implement logic here

    if (isEmpty(discount)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }


     const response = plainToInstance(
      GetDetailDiscountResponseDto,
       discount, 
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateDiscountRequestDto): Promise<any> {
    const { id } = request;
    const discount = await this.discountRepository.findOneById(id);

    if (isEmpty(discount)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newDiscountSchema = this.discountRepository.updateDocument(discount, request);

    const discountUpdate = await this.discountRepository.findByIdAndUpdate(id, newDiscountSchema);
    // implement logic here
    return new ResponseBuilder(discountUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteDiscountRequestDto): Promise<any> {
    const { id } = request;
    const discount = await this.discountRepository.findOneById(id);

    if (isEmpty(discount)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.discountRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
