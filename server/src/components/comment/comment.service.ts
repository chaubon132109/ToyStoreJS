import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { CommentServiceInterface } from './interface/comment.service.interface';
import { CommentRepositoryInterface } from './interface/comment.repository.interface';

import { GetListCommentRequestDto } from './dto/request/get-list-comment.request.dto';
import { GetDetailCommentRequestDto } from './dto/request/get-detail-comment.request.dto';
import { CreateCommentRequestDto } from './dto/request/create-comment.request.dto';
import { UpdateCommentRequestDto } from './dto/request/update-comment.request.dto';
import { DeleteCommentRequestDto } from './dto/request/delete-comment.request.dto';

import { GetListCommentResponseDto } from './dto/response/get-list-comment.response.dto';
import { GetDetailCommentResponseDto } from './dto/response/get-detail-comment.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';
import { GetListCommentByItemRequestDto } from './dto/request/get-comment-by-item-id.dto';

@Injectable()
export class CommentService implements CommentServiceInterface {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @Inject('CommentRepositoryInterface')
    private readonly commentRepository: CommentRepositoryInterface,
  ) {}

  async create(request: CreateCommentRequestDto): Promise<any> {
    const commentDocument = this.commentRepository.createDocument(request);

    const comment = await this.commentRepository.create(commentDocument);

    return new ResponseBuilder(comment)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: GetListCommentRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.commentRepository.getList(request);

    // implement logic here

    const response = plainToInstance(GetListCommentResponseDto, data, {
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

  async getDetail(request: GetDetailCommentRequestDto): Promise<any> {
    const comment = await this.commentRepository.getDetail(request);

    // implement logic here

    if (isEmpty(comment)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    const response = plainToInstance(GetDetailCommentResponseDto, comment, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateCommentRequestDto): Promise<any> {
    const { id } = request;
    const comment = await this.commentRepository.findOneById(id);

    if (isEmpty(comment)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newCommentSchema = this.commentRepository.updateDocument(
      comment,
      request,
    );

    const commentUpdate = await this.commentRepository.findByIdAndUpdate(
      id,
      newCommentSchema,
    );
    // implement logic here
    return new ResponseBuilder(commentUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteCommentRequestDto): Promise<any> {
    const { id } = request;
    const comment = await this.commentRepository.findOneById(id);

    if (isEmpty(comment)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.commentRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
  async getCommentByItemId(
    request: GetListCommentByItemRequestDto,
  ): Promise<any> {
    const { page } = request;
    const { comment, count } =
      await this.commentRepository.getListCommentByItemId(request);

    return new ResponseBuilder<PagingResponse>({
      items: comment,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
