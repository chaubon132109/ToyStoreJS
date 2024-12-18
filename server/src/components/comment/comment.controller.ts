import { isEmpty } from 'lodash';
import {
  Controller,
  Body,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CommentServiceInterface } from './interface/comment.service.interface';
import { GetListCommentRequestDto } from './dto/request/get-list-comment.request.dto';
import { GetDetailCommentRequestDto } from './dto/request/get-detail-comment.request.dto';
import { CreateCommentRequestDto } from './dto/request/create-comment.request.dto';
import { UpdateCommentRequestDto } from './dto/request/update-comment.request.dto';
import { DeleteCommentRequestDto } from './dto/request/delete-comment.request.dto';
import { GetListCommentByItemRequestDto } from './dto/request/get-comment-by-item-id.dto';
import { AuthGuard } from '@core/guards/authorization.guard';

@Controller('comments')
export class CommentController {
  constructor(
    @Inject('CommentServiceInterface')
    private readonly commentService: CommentServiceInterface,
  ) {}

  @Get('detail/:id')
  @ApiOperation({
    tags: ['Comments'],
    summary: 'Chi tiết Comments',
    description: 'Chi tiết Comments',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(
    @Param() param: GetDetailCommentRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.commentService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Comments'],
    summary: 'Danh sách Comments',
    description: 'Danh sách Comments',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListCommentRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.commentService.getList(request);
  }
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    tags: ['Comments'],
    summary: 'Tạo Comments mới',
    description: 'Tạo Comments mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateCommentRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.commentService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Comments'],
    summary: 'Cập nhật Comments',
    description: 'Cập nhật Comments',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateCommentRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.commentService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Comments'],
    summary: 'Xóa Comments',
    description: 'Xóa Comments',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {
    return this.commentService.delete({ id } as DeleteCommentRequestDto);
  }

  @Get('/item')
  @ApiOperation({
    tags: ['Comments'],
    summary: 'Danh sách Comments theo Item',
    description: 'Danh sách Comments theo Item',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getListByItemId(
    @Query() query: GetListCommentByItemRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.commentService.getCommentByItemId(request);
  }
}
