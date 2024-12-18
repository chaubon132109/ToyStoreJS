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
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CategoryServiceInterface } from './interface/category.service.interface';
import { GetListCategoryRequestDto } from './dto/request/get-list-category.request.dto';
import { GetDetailCategoryRequestDto } from './dto/request/get-detail-category.request.dto';
import { CreateCategoryRequestDto } from './dto/request/create-category.request.dto';
import { UpdateCategoryRequestDto } from './dto/request/update-category.request.dto';
import { DeleteCategoryRequestDto } from './dto/request/delete-category.request.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject('CategoryServiceInterface')
    private readonly categoryService: CategoryServiceInterface,
  ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Categorys'],
    summary: 'Chi tiết Categorys',
    description: 'Chi tiết Categorys',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(
    @Param() param: GetDetailCategoryRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.categoryService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Categorys'],
    summary: 'Danh sách Categorys',
    description: 'Danh sách Categorys',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListCategoryRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.categoryService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Categorys'],
    summary: 'Tạo Categorys mới',
    description: 'Tạo Categorys mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateCategoryRequestDto) {
    console.log('🚀 ~ CategoryController ~ create ~ payload:', payload);
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.categoryService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Categorys'],
    summary: 'Cập nhật Categorys',
    description: 'Cập nhật Categorys',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateCategoryRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.categoryService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Categorys'],
    summary: 'Xóa Categorys',
    description: 'Xóa Categorys',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {
    return this.categoryService.delete({ id } as DeleteCategoryRequestDto);
  }
}
