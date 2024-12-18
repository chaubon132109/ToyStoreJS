
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

import { ImageServiceInterface } from './interface/image.service.interface';
import { GetListImageRequestDto } from './dto/request/get-list-image.request.dto';
import { GetDetailImageRequestDto } from './dto/request/get-detail-image.request.dto';
import { CreateImageRequestDto } from './dto/request/create-image.request.dto';
import { UpdateImageRequestDto } from './dto/request/update-image.request.dto';
import { DeleteImageRequestDto } from './dto/request/delete-image.request.dto';

@Controller('images')
export class ImageController {
  constructor(
    @Inject('ImageServiceInterface')
    private readonly imageService: ImageServiceInterface,
    ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Images'],
    summary: 'Chi tiết Images',
    description: 'Chi tiết Images',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async getDetail(@Param() param : GetDetailImageRequestDto ) : Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.imageService.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['Images'],
    summary: 'Danh sách Images',
    description: 'Danh sách Images',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public getList(@Query() query: GetListImageRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.imageService.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['Images'],
    summary: 'Tạo Images mới',
    description: 'Tạo Images mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public create(@Body() payload: CreateImageRequestDto) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.imageService.create(request);
  }

  @Put('/:id')
  @ApiOperation({
    tags: ['Images'],
    summary: 'Cập nhật Images',
    description: 'Cập nhật Images',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async update(
    @Param('id') id,
    @Body() body: UpdateImageRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.imageService.update(request);
  }

  @Delete('/:id')
  @ApiOperation({
    tags: ['Images'],
    summary: 'Xóa Images',
    description: 'Xóa Images',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public delete(@Param('id') id): Promise<any> {

    return  this.imageService.delete({id} as DeleteImageRequestDto);
  }
}
