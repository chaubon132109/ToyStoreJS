---
to: "src/components/<%= h.fileName(name) %>/<%= h.moduleFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('Module') %>
---
<%
  RepositoryNameInterface = h.RepositoryNameInterface(name);
  RepositoryName = h.RepositoryName(name);
  repositoryName = h.changeCase.camel(RepositoryName);
  repositoryInterfaceFileName = h.repositoryInterfaceFileName(name);

  QueryBuilderName = h.QueryBuilderName(name);
  QueryBuilderName = h.QueryBuilderName(name);

  EntityName = h.EntityName(name);
  entityName = h.changeCase.camel(EntityName);
  SchemaName = h.SchemaName(name);
  schemaName = h.changeCase.camel(SchemaName);
  SchemaModelName = h.schemaModelName(name);
  schemaModelName = h.changeCase.camel(SchemaModelName);
  entityFileName = h.entityFileName(name);
  fileName = h.fileName(name);

  GetListDtoName = h.GetListDtoName(name);
  GetDetailDtoName = h.GetDetailDtoName(name);

  getListDtoFileName = h.getListDtoFileName(name);
  getDetailDtoFileName = h.getDetailDtoFileName(name);
 ModuleName = h.ModuleName(name);

 ControllerName = h.ControllerName(name);
 controllerFileName = h.controllerFileName(name);

 ServiceName = h.ServiceName(name);
 serviceFileName = h.serviceFileName(name);

 RepositoryName = h.RepositoryName(name);
 RepositoryNameInterface = h.RepositoryNameInterface(name);
%>
import { Module } from '@nestjs/common';

import { <%= ControllerName %> } from './<%= controllerFileName %>';
import { <%= ServiceName %> } from './<%= serviceFileName %>';
import { <%= SchemaName %>Repository } from 'src/mongo/repository/<%= schemaName %>/<%= schemaName %>.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { <%= SchemaModelName %> } from 'src/models/<%= fileName %>/<%= fileName %>.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: '<%= SchemaName %>', schema: <%= SchemaModelName %> }]),
  ],
  providers: [
    {
      provide:'<%= ServiceName %>Interface',
      useClass: <%= ServiceName %>,
    },
    {
      provide: '<%= RepositoryNameInterface %>',
      useClass: <%= RepositoryName %>,
    },
  ],
  exports: [
    {
      provide:'<%= ServiceName %>Interface',
      useClass: <%= ServiceName %>,
    }
  ],
  controllers: [<%= ControllerName %>]
})

export class <%= ModuleName %> {}