
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

import { DiscountServiceInterface } from './interface/discount.service.interface';
import { GetListDiscountRequestDto } from './dto/request/get-list-discount.request.dto';
import { GetDetailDiscountRequestDto } from './dto/request/get-detail-discount.request.dto';
import { CreateDiscountRequestDto } from './dto/request/create-discount.request.dto';
import { UpdateDiscountRequestDto } from './dto/request/update-discount.request.dto';
import { DeleteDiscountRequestDto } from './dto/request/delete-discount.request.dto';

@Controller('discounts')
export class DiscountController {
  constructor(
    @Inject('DiscountServiceInterface')
    private readonly discountService: DiscountServiceInterface,
    ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Discounts'],
    summary: 'Chi tiết Discounts',
    description: 'Chi tiết Discounts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(@Param() param : GetDetailDiscountRequestDto ) : Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.discountService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Discounts'],
    summary: 'Danh sách Discounts',
    description: 'Danh sách Discounts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListDiscountRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.discountService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Discounts'],
    summary: 'Tạo Discounts mới',
    description: 'Tạo Discounts mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateDiscountRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.discountService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Discounts'],
    summary: 'Cập nhật Discounts',
    description: 'Cập nhật Discounts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateDiscountRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.discountService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Discounts'],
    summary: 'Xóa Discounts',
    description: 'Xóa Discounts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {

    return  this.discountService.delete({id} as DeleteDiscountRequestDto);
  }
}
