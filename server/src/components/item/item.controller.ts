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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { ItemServiceInterface } from './interface/item.service.interface';
import { GetListItemRequestDto } from './dto/request/get-list-item.request.dto';
import { GetDetailItemRequestDto } from './dto/request/get-detail-item.request.dto';
import {
  CreateFormItemRequestDto,
  CreateItemRequestDto,
} from './dto/request/create-item.request.dto';
import { UpdateItemRequestDto } from './dto/request/update-item.request.dto';
import { DeleteItemRequestDto } from './dto/request/delete-item.request.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@Controller('items')
export class ItemController {
  constructor(
    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,
  ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Items'],
    summary: 'Chi tiết Items',
    description: 'Chi tiết Items',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(
    @Param() param: GetDetailItemRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.itemService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Items'],
    summary: 'Danh sách Items',
    description: 'Danh sách Items',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListItemRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.itemService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Items'],
    summary: 'Tạo Items mới',
    description: 'Tạo Items mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() formData: CreateFormItemRequestDto) {
    console.log('Form Data:', formData);

    const { request, responseError } = formData;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.itemService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Items'],
    summary: 'Cập nhật Items',
    description: 'Cập nhật Items',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateItemRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.itemService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Items'],
    summary: 'Xóa Items',
    description: 'Xóa Items',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {
    return this.itemService.delete({ id } as DeleteItemRequestDto);
  }
}
