---
to: "src/components/<%= h.fileName(name) %>/<%= h.serviceFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('Service') %>
---
<%

 ClassName = h.ClassName(name);
 fieldName = h.changeCase.camel(ClassName);

 DtoName = h.DtoName(name);
 dtoFileName = h.dtoFileName(name);

 EntityName = h.EntityName(name);
 entityName = h.changeCase.camel(EntityName);
 entityFileName = h.entityFileName(name);

 ServiceName = h.ServiceName(name);
 serviceInterfaceFileName = h.serviceInterfaceFileName(name);
  repositoryInterfaceFileName = h.repositoryInterfaceFileName(name);

 UpdateDtoName = h.UpdateDtoName(name);
 updateDtoFileName = h.updateDtoFileName(name);
 updateDtoName = h.changeCase.camel(UpdateDtoName);
  SchemaName = h.SchemaName(name);
  schemaName = h.changeCase.camel(SchemaName);
  SchemaModelName = h.schemaModelName(name);
  schemaModelName = h.changeCase.camel(SchemaModelName);
 fileName = h.fileName(name);

 RepositoryName = h.RepositoryName(name);
 repositoryName = h.changeCase.camel(RepositoryName);
 RepositoryNameInterface = h.RepositoryNameInterface(name);
 repositoryFileName = h.repositoryFileName(name);

 createFunctionName = 'create' + ClassName;
 updateFunctionName = 'update' + ClassName;
 deleteFunctionName = 'delete' + ClassName;
 getAllFunctionName = 'getList' + ClassName;
 getSingleFunctionName = 'getDetail' + ClassName;
 controllerName = moduleName + 'Controller';
 serviceName = moduleName + 'Service';
 CreateDtoName = h.CreateDtoName(name);
 createDtoFileName = h.createDtoFileName(name);

  ServiceNameInterface = h.ServiceNameInterface(name);

 GetDetailResponseDtoName = h.GetDetailResponseDtoName(name);
 GetListResponseDtoName = h.GetListResponseDtoName(name);

 getListResponseDtoFileName = h.getListResponseDtoFileName(name);
  getDetailResponseDtoFileName = h.getDetailResponseDtoFileName(name);

  name = h.Name(name);
%>

import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { <%= ServiceNameInterface %> } from './interface/<%= serviceInterfaceFileName %>';
import { <%= RepositoryNameInterface %> } from './interface/<%= repositoryInterfaceFileName %>';

import { <%= GetListDtoName %> } from './dto/request/<%= getListDtoFileName %>';
import { <%= GetDetailDtoName %> } from './dto/request/<%= getDetailDtoFileName %>';
import { <%= CreateDtoName %> } from './dto/request/<%= createDtoFileName %>';
import { <%= UpdateDtoName %> } from './dto/request/<%= updateDtoFileName %>';
import { <%= DeleteDtoName %> } from './dto/request/<%= deleteDtoFileName %>';

import { <%= GetListResponseDtoName%> } from './dto/response/<%= getListResponseDtoFileName %>';
import { <%= GetDetailResponseDtoName%> } from './dto/response/<%= getDetailResponseDtoFileName %>';

import { ResponseCodeEnum } from '@constant/response-code.enum';


@Injectable()
export class <%= ServiceName %> implements <%= ServiceNameInterface %>{
  private readonly logger = new Logger(<%= ServiceName %>.name);

  constructor(
    @Inject('<%= RepositoryNameInterface %>')
    private readonly <%= repositoryName %>: <%= RepositoryNameInterface %>,


  ) {}

  async create(request: <%= CreateDtoName %>): Promise<any> {
    const <%= schemaName %>Document = this.<%= repositoryName %>.createDocument(request);

    const <%= name %> = await this.<%= repositoryName %>.create(<%= schemaName %>Document);

    return new ResponseBuilder(<%= name %>)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getList(request: <%= GetListDtoName %>): Promise<any> {
    const { page } = request;
    const { data, count } = await this.<%= repositoryName %>.getList(request);

    // implement logic here

    const response = plainToInstance(<%=GetListResponseDtoName%>, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getDetail(request: <%= GetDetailDtoName %>): Promise<any> {
    const <%= name %> = await this.<%= repositoryName %>.getDetail(request);

    // implement logic here

    if (isEmpty(<%= name %>)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }


     const response = plainToInstance(
      <%=GetDetailResponseDtoName%>,
       <%= name %>, 
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: <%= UpdateDtoName %>): Promise<any> {
    const { id } = request;
    const <%= name %> = await this.<%= repositoryName %>.findOneById(id);

    if (isEmpty(<%= name %>)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const new<%= SchemaModelName %> = this.<%= name %>Repository.updateDocument(<%= name %>, request);

    const <%= name %>Update = await this.<%= name %>Repository.findByIdAndUpdate(id, new<%= SchemaModelName %>);
    // implement logic here
    return new ResponseBuilder(<%= name %>Update)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: <%= DeleteDtoName %>): Promise<any> {
    const { id } = request;
    const <%= name %> = await this.<%= repositoryName %>.findOneById(id);

    if (isEmpty(<%= name %>)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.<%= repositoryName %>.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
}
