---
to: "src/components/<%= h.fileName(name) %>/<%= h.controllerFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('Controller') %>
---
<%

 SchemaName = h.SchemaName(name);
 schemaName = h.changeCase.camel(SchemaName);

 ClassName = h.ClassName(name);
 TableName = h.TableName(name);
 paramIdName = 'id';
 paramIdFieldName = h.changeCase.camel(ClassName) + 'Id';
 camelName = h.changeCase.camel(TableName)
 capitalizeName = h.inflection.capitalize(TableName)

 moduleName = h.moduleName(name);
 fileName = h.fileName(name);
 ControllerName = h.ControllerName(name);
 ServiceName = h.ServiceName(name);
 ServiceNameInterface = h.ServiceNameInterface(name);
 serviceName = h.changeCase.camel(ServiceName);
 createFunctionName = 'create';
 updateFunctionName = 'update';
 deleteFunctionName = 'delete';
 getAllFunctionName = 'getList';
 getDetailFunctionName = 'getDetail';
 CreateDtoName = h.CreateDtoName(name);
 createDtoName = h.changeCase.camel(CreateDtoName);
 UpdateDtoName = h.UpdateDtoName(name);
 updateDtoName = h.changeCase.camel(UpdateDtoName);
 DtoName = h.DtoName(name);
 createDtoFileName = h.createDtoFileName(name);
 dtoFileName = h.dtoFileName(name);

  serviceFileName = h.serviceFileName(name);
  serviceInterfaceFileName = h.serviceInterfaceFileName(name);

  GetListDtoName = h.GetListDtoName(name);
  GetDetailDtoName = h.GetDetailDtoName(name);
  CreateDtoName = h.CreateDtoName(name);
  UpdateDtoName = h.UpdateDtoName(name);
  DeleteDtoName = h.DeleteDtoName(name);

  getListDtoFileName = h.getListDtoFileName(name);
  getDetailDtoFileName = h.getDetailDtoFileName(name);
  createDtoFileName = h.createDtoFileName(name);
  updateDtoFileName = h.updateDtoFileName(name);
  deleteDtoFileName = h.deleteDtoFileName(name);
%>
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

import { <%= ServiceNameInterface %> } from './interface/<%= serviceInterfaceFileName %>';
import { <%= GetListDtoName %> } from './dto/request/<%= getListDtoFileName %>';
import { <%= GetDetailDtoName %> } from './dto/request/<%= getDetailDtoFileName %>';
import { <%= CreateDtoName %> } from './dto/request/<%= createDtoFileName %>';
import { <%= UpdateDtoName %> } from './dto/request/<%= updateDtoFileName %>';
import { <%= DeleteDtoName %> } from './dto/request/<%= deleteDtoFileName %>';

@Controller('<%= h.inflection.dasherize(fileName).toLowerCase() %>s')
export class <%= ControllerName %> {
  constructor(
    @Inject('<%= ServiceNameInterface %>')
    private readonly <%= serviceName %>: <%= ServiceNameInterface %>,
    ) {}

  @Get('/:<%= paramIdName %>')
  @ApiOperation({
    tags: ['<%= capitalizeName %>'],
    summary: 'Chi tiết <%= capitalizeName %>',
    description: 'Chi tiết <%= capitalizeName %>',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async <%= getDetailFunctionName %>(@Param() param : <%= GetDetailDtoName %> ) : Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.<%= serviceName %>.getDetail(request);
  }

  @Get()
  @ApiOperation({
    tags: ['<%= capitalizeName %>'],
    summary: 'Danh sách <%= capitalizeName %>',
    description: 'Danh sách <%= capitalizeName %>',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public <%= getAllFunctionName %>(@Query() query: <%= GetListDtoName %>): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.<%= serviceName %>.getList(request);
  }

  @Post()
  @ApiOperation({
    tags: ['<%= capitalizeName %>'],
    summary: 'Tạo <%= capitalizeName %> mới',
    description: 'Tạo <%= capitalizeName %> mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public <%= createFunctionName %>(@Body() payload: <%= CreateDtoName %>) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return  this.<%= serviceName %>.create(request);
  }

  @Put('/:<%= paramIdName %>')
  @ApiOperation({
    tags: ['<%= capitalizeName %>'],
    summary: 'Cập nhật <%= capitalizeName %>',
    description: 'Cập nhật <%= capitalizeName %>',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public async <%= updateFunctionName %>(
    @Param('id') id,
    @Body() body: <%= UpdateDtoName %>,
  ): Promise<any> {
    const { request, responseError } = body;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.<%= serviceName %>.update(request);
  }

  @Delete('/:<%= paramIdName %>')
  @ApiOperation({
    tags: ['<%= capitalizeName %>'],
    summary: 'Xóa <%= capitalizeName %>',
    description: 'Xóa <%= capitalizeName %>',
  })
  @ApiResponse({
    status: 200,
    description: 'Thành công',
  })
  public <%= deleteFunctionName %>(@Param('id') id): Promise<any> {

    return  this.<%= serviceName %>.delete({id} as <%= DeleteDtoName %>);
  }
}
