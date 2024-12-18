
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

import { OrderDetailServiceInterface } from './interface/order-detail.service.interface';
import { GetListOrderDetailRequestDto } from './dto/request/get-list-order-detail.request.dto';
import { GetDetailOrderDetailRequestDto } from './dto/request/get-detail-order-detail.request.dto';
import { CreateOrderDetailRequestDto } from './dto/request/create-order-detail.request.dto';
import { UpdateOrderDetailRequestDto } from './dto/request/update-order-detail.request.dto';
import { DeleteOrderDetailRequestDto } from './dto/request/delete-order-detail.request.dto';

@Controller('order-details')
export class OrderDetailController {
  constructor(
    @Inject('OrderDetailServiceInterface')
    private readonly orderDetailService: OrderDetailServiceInterface,
    ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Order-details'],
    summary: 'Chi tiết Order-details',
    description: 'Chi tiết Order-details',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(@Param() param : GetDetailOrderDetailRequestDto ) : Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.orderDetailService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Order-details'],
    summary: 'Danh sách Order-details',
    description: 'Danh sách Order-details',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListOrderDetailRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.orderDetailService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Order-details'],
    summary: 'Tạo Order-details mới',
    description: 'Tạo Order-details mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateOrderDetailRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.orderDetailService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Order-details'],
    summary: 'Cập nhật Order-details',
    description: 'Cập nhật Order-details',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateOrderDetailRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.orderDetailService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Order-details'],
    summary: 'Xóa Order-details',
    description: 'Xóa Order-details',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {

    return  this.orderDetailService.delete({id} as DeleteOrderDetailRequestDto);
  }
}
