
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

import { ShippingMethodServiceInterface } from './interface/shipping-method.service.interface';
import { GetListShippingMethodRequestDto } from './dto/request/get-list-shipping-method.request.dto';
import { GetDetailShippingMethodRequestDto } from './dto/request/get-detail-shipping-method.request.dto';
import { CreateShippingMethodRequestDto } from './dto/request/create-shipping-method.request.dto';
import { UpdateShippingMethodRequestDto } from './dto/request/update-shipping-method.request.dto';
import { DeleteShippingMethodRequestDto } from './dto/request/delete-shipping-method.request.dto';

@Controller('shipping-methods')
export class ShippingMethodController {
  constructor(
    @Inject('ShippingMethodServiceInterface')
    private readonly shippingMethodService: ShippingMethodServiceInterface,
    ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Shipping-methods'],
    summary: 'Chi tiết Shipping-methods',
    description: 'Chi tiết Shipping-methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(@Param() param : GetDetailShippingMethodRequestDto ) : Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.shippingMethodService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Shipping-methods'],
    summary: 'Danh sách Shipping-methods',
    description: 'Danh sách Shipping-methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListShippingMethodRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.shippingMethodService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Shipping-methods'],
    summary: 'Tạo Shipping-methods mới',
    description: 'Tạo Shipping-methods mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateShippingMethodRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.shippingMethodService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Shipping-methods'],
    summary: 'Cập nhật Shipping-methods',
    description: 'Cập nhật Shipping-methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateShippingMethodRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.shippingMethodService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Shipping-methods'],
    summary: 'Xóa Shipping-methods',
    description: 'Xóa Shipping-methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {

    return  this.shippingMethodService.delete({id} as DeleteShippingMethodRequestDto);
  }
}
