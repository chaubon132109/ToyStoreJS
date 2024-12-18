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

import { ShippingAddressServiceInterface } from './interface/shipping-address.service.interface';
import { GetListShippingAddressRequestDto } from './dto/request/get-list-shipping-address.request.dto';
import { GetDetailShippingAddressRequestDto } from './dto/request/get-detail-shipping-address.request.dto';
import { CreateShippingAddressRequestDto } from './dto/request/create-shipping-address.request.dto';
import { UpdateShippingAddressRequestDto } from './dto/request/update-shipping-address.request.dto';
import { DeleteShippingAddressRequestDto } from './dto/request/delete-shipping-address.request.dto';
import { GetDefaultShippingAddressRequestDto } from './dto/request/get-default-shiping-address.request.dto';
import { request } from 'http';
import { BaseDto } from '@core/dto/base.dto';
import { AuthGuard } from '@core/guards/authorization.guard';
import { query } from 'express';

@UseGuards(AuthGuard)
@Controller('shipping-addresses')
export class ShippingAddressController {
  constructor(
    @Inject('ShippingAddressServiceInterface')
    private readonly shippingAddressService: ShippingAddressServiceInterface,
  ) {}

  @Get('/detail/:id')
  @ApiOperation({
    tags: ['Shipping-addresss'],
    summary: 'Chi tiết Shipping-addresss',
    description: 'Chi tiết Shipping-addresss',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(
    @Param() param: GetDetailShippingAddressRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.shippingAddressService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Shipping-addresss'],
    summary: 'Danh sách Shipping-addresss',
    description: 'Danh sách Shipping-addresss',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(
    @Query() query: GetListShippingAddressRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.shippingAddressService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Shipping-addresss'],
    summary: 'Tạo Shipping-addresss mới',
    description: 'Tạo Shipping-addresss mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateShippingAddressRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.shippingAddressService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Shipping-addresss'],
    summary: 'Cập nhật Shipping-addresss',
    description: 'Cập nhật Shipping-addresss',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateShippingAddressRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.shippingAddressService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Shipping-addresss'],
    summary: 'Xóa Shipping-addresss',
    description: 'Xóa Shipping-addresss',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {
    return this.shippingAddressService.delete({
      id,
    } as DeleteShippingAddressRequestDto);
  }

  @Get('/default')
  @ApiOperation({
    tags: ['Shipping-addresss'],
    summary: 'Lay Shipping-addresss mac dinh',
    description: 'Lay Shipping-addresss mac dinh',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getDefaultShippingAddress(
    @Query() query: GetDefaultShippingAddressRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.shippingAddressService.getDefaultShippingAddress(request);
  }

  @Get('/user-id')
  public getAddressByUserId(@Query() request: BaseDto): Promise<any> {
    const { userId } = request.request;
    return this.shippingAddressService.getAddressByUserId(userId);
  }
}
