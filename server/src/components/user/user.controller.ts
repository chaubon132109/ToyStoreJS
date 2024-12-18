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

import { UserServiceInterface } from './interface/user.service.interface';
import { GetListUserRequestDto } from './dto/request/get-list-user.request.dto';
import { GetDetailUserRequestDto } from './dto/request/get-detail-user.request.dto';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { DeleteUserRequestDto } from './dto/request/delete-user.request.dto';
import { query } from 'express';
import { BaseDto } from '@core/dto/base.dto';
import { AuthGuard } from '@core/guards/authorization.guard';

@Controller('users')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @Get('/detail/:id')
  @ApiOperation({
    tags: ['Users'],
    summary: 'Chi tiết Users',
    description: 'Chi tiết Users',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(
    @Param() param: GetDetailUserRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.userService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Users'],
    summary: 'Danh sách Users',
    description: 'Danh sách Users',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListUserRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.userService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Users'],
    summary: 'Tạo Users mới',
    description: 'Tạo Users mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateUserRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.userService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Users'],
    summary: 'Cập nhật Users',
    description: 'Cập nhật Users',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateUserRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.userService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Users'],
    summary: 'Xóa Users',
    description: 'Xóa Users',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {
    return this.userService.delete({ id } as DeleteUserRequestDto);
  }

  @UseGuards(AuthGuard)
  @Get('/get-my-info')
  @ApiOperation({
    tags: ['Users'],
    summary: 'Lấy thông tin cá nhân',
    description: 'Lấy thông tin cá nhân',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getMyInfo(@Query() query: BaseDto) {
    console.log('🚀 ~ UserController ~ getMyInfo ~ query:', query);
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.userService.getUserDetail(request);
  }
}
