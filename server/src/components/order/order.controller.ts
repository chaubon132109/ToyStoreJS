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

import { OrderServiceInterface } from './interface/order.service.interface';
import { GetListOrderRequestDto } from './dto/request/get-list-order.request.dto';
import { GetDetailOrderRequestDto } from './dto/request/get-detail-order.request.dto';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { UpdateOrderRequestDto } from './dto/request/update-order.request.dto';
import { DeleteOrderRequestDto } from './dto/request/delete-order.request.dto';
import { AuthGuard } from '@core/guards/authorization.guard';
import { changeOrderStatusRequestDto } from './dto/request/change-order-status.request.dto';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(
    @Inject('OrderServiceInterface')
    private readonly orderService: OrderServiceInterface,
  ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Chi tiết Orders',
    description: 'Chi tiết Orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(
    @Param() param: GetDetailOrderRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.orderService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Danh sách Orders',
    description: 'Danh sách Orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListOrderRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.orderService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Tạo Orders mới',
    description: 'Tạo Orders mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateOrderRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.orderService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Cập nhật Orders',
    description: 'Cập nhật Orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateOrderRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.orderService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Xóa Orders',
    description: 'Xóa Orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {
    return this.orderService.delete({ id } as DeleteOrderRequestDto);
  }

  @Get('/my-order')
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Danh sách Orders theo người dùng',
    description: 'Danh sách Orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành cong',
  })
  public getOrderByUserId(
    @Query() query: GetListOrderRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.orderService.getOrderByUserId(request);
  }

  @Put('/change-status')
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Cập nhật trang thai Orders',
    description: 'Cập nhật trang thai Orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public changeOrderStatus(@Body() body: changeOrderStatusRequestDto) {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.orderService.changeOrderStatus(request);
  }

  @Get('/recommend-items/:id')
  @ApiOperation({
    tags: ['Orders'],
    summary: 'Danh sách item khóa',
    description: 'Danh sách item khóa',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành cong',
  })
  public recommendItems(@Param() param: any): Promise<any> {
    return this.orderService.recommendItems(param.id);
  }
}
