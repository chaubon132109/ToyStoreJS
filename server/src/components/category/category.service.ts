import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { CategoryServiceInterface } from './interface/category.service.interface';
import { CategoryRepositoryInterface } from './interface/category.repository.interface';

import { GetListCategoryRequestDto } from './dto/request/get-list-category.request.dto';
import { GetDetailCategoryRequestDto } from './dto/request/get-detail-category.request.dto';
import { CreateCategoryRequestDto } from './dto/request/create-category.request.dto';
import { UpdateCategoryRequestDto } from './dto/request/update-category.request.dto';
import { DeleteCategoryRequestDto } from './dto/request/delete-category.request.dto';

import { GetListCategoryResponseDto } from './dto/response/get-list-category.response.dto';
import { GetDetailCategoryResponseDto } from './dto/response/get-detail-category.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async create(request: CreateCategoryRequestDto): Promise<any> {
    const categoryDocument = this.categoryRepository.createDocument(request);

    const category = await this.categoryRepository.create(categoryDocument);

    return new ResponseBuilder(category)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListCategoryRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.categoryRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListCategoryResponseDto, data, {
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

  async getDetail(request: GetDetailCategoryRequestDto): Promise<any> {
    const category = await this.categoryRepository.getDetail(request);

    // implement logic here

    if (isEmpty(category)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    const response = plainToInstance(GetDetailCategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateCategoryRequestDto): Promise<any> {
    const { id } = request;
    const category = await this.categoryRepository.findOneById(id);

    if (isEmpty(category)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newCategorySchema = this.categoryRepository.updateDocument(
      category,
      request,
    );

    const categoryUpdate = await this.categoryRepository.findByIdAndUpdate(
      id,
      newCategorySchema,
    );
    // implement logic here
    return new ResponseBuilder(categoryUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteCategoryRequestDto): Promise<any> {
    const { id } = request;
    const category = await this.categoryRepository.findOneById(id);

    if (isEmpty(category)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.categoryRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
