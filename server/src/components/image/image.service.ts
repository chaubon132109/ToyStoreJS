

import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { ImageServiceInterface } from './interface/image.service.interface';
import { ImageRepositoryInterface } from './interface/image.repository.interface';

import { GetListImageRequestDto } from './dto/request/get-list-image.request.dto';
import { GetDetailImageRequestDto } from './dto/request/get-detail-image.request.dto';
import { CreateImageRequestDto } from './dto/request/create-image.request.dto';
import { UpdateImageRequestDto } from './dto/request/update-image.request.dto';
import { DeleteImageRequestDto } from './dto/request/delete-image.request.dto';

import { GetListImageResponseDto } from './dto/response/get-list-image.response.dto';
import { GetDetailImageResponseDto } from './dto/response/get-detail-image.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';


@Injectable()
export class ImageService implements ImageServiceInterface{
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @Inject('ImageRepositoryInterface')
    private readonly imageRepository: ImageRepositoryInterface,


  ) {}

  async create(request: CreateImageRequestDto): Promise<any> {
    const imageDocument = this.imageRepository.createDocument(request);

    const image = await this.imageRepository.create(imageDocument);

    return new ResponseBuilder(image)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListImageRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.imageRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListImageResponseDto, data, {
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

  async getDetail(request: GetDetailImageRequestDto): Promise<any> {
    const image = await this.imageRepository.getDetail(request);

    // implement logic here

    if (isEmpty(image)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }


     const response = plainToInstance(
      GetDetailImageResponseDto,
       image, 
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateImageRequestDto): Promise<any> {
    const { id } = request;
    const image = await this.imageRepository.findOneById(id);

    if (isEmpty(image)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newImageSchema = this.imageRepository.updateDocument(image, request);

    const imageUpdate = await this.imageRepository.findByIdAndUpdate(id, newImageSchema);
    // implement logic here
    return new ResponseBuilder(imageUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteImageRequestDto): Promise<any> {
    const { id } = request;
    const image = await this.imageRepository.findOneById(id);

    if (isEmpty(image)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.imageRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
