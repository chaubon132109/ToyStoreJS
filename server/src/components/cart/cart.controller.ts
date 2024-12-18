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

import { CartServiceInterface } from './interface/cart.service.interface';
import { GetListCartRequestDto } from './dto/request/get-list-cart.request.dto';
import { GetDetailCartRequestDto } from './dto/request/get-detail-cart.request.dto';
import { CreateCartRequestDto } from './dto/request/create-cart.request.dto';
import { UpdateCartRequestDto } from './dto/request/update-cart.request.dto';
import { DeleteCartRequestDto } from './dto/request/delete-cart.request.dto';
import { UpdateCartQuantityRequestDto } from './dto/request/update-cart-quantity.request.dto';
import { getListCartByIdsRequestDto } from './dto/request/get-list-cart-by-ids.request.dto';
import { AuthGuard } from '@core/guards/authorization.guard';
@UseGuards(AuthGuard)
@Controller('carts')
export class CartController {
  constructor(
    @Inject('CartServiceInterface')
    private readonly cartService: CartServiceInterface,
  ) {}

  @Get('/detail/:id')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Chi tiết Carts',
    description: 'Chi tiết Carts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(
    @Param() param: GetDetailCartRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.cartService.getDetail(request);
  }

  @Get('/')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Danh sách Carts',
    description: 'Danh sách Carts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListCartRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.cartService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Tạo Carts mới',
    description: 'Tạo Carts mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateCartRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.cartService.create(request);
  }

  @Put('/update/:id')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Cập nhật Carts',
    description: 'Cập nhật Carts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateCartRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.cartService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Xóa Carts',
    description: 'Xóa Carts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {
    return this.cartService.delete({ id } as DeleteCartRequestDto);
  }

  @Post('/add-to-cart')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Tạo Carts',
    description: 'Tạo Carts',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành lại',
  })
  public async addToCart(@Body() payload: CreateCartRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.cartService.addToCart(request);
  }

  @Get('/get-cart-by-user')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Danh sách Carts theo user',
    description: 'Danh sách Carts theo user',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành lại',
  })
  public async getListCartByUserId(
    @Query() query: GetListCartRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.cartService.getListCartByUserId(request);
  }

  @Put('/update-quantity')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Cập nhật quantity',
    description: 'Cập nhật quantity',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành lại',
  })
  public async updateQuantity(
    @Body() payload: UpdateCartQuantityRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.cartService.updateCart(request);
  }

  @Get('/get-cart-by-ids')
  @ApiOperation({
    tags: ['Carts'],
    summary: 'Danh sách Carts theo ids',
    description: 'Danh sách Carts theo ids',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành lại',
  })
  public async getCartDetailByIds(
    @Query() query: getListCartByIdsRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.cartService.getCartDetailByIds(request);
  }
}
