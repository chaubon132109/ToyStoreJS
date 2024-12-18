---
to: "src/components/<%= h.fileName(name) %>/interface/<%= h.repositoryInterfaceFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('RepositoryInterface') %>
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

  GetListDtoName = h.GetListDtoName(name);
  GetDetailDtoName = h.GetDetailDtoName(name);

  getListDtoFileName = h.getListDtoFileName(name);
  getDetailDtoFileName = h.getDetailDtoFileName(name);
%>
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { <%= GetListDtoName %> } from '../dto/request/<%= getListDtoFileName %>';
import { <%= GetDetailDtoName %> } from '../dto/request/<%= getDetailDtoFileName %>';
import {  <%= SchemaName %> } from 'src/models/<%= schemaName %>/<%= schemaName %>.schema';

export interface <%= RepositoryNameInterface %>
 extends BaseInterfaceRepository<<%=SchemaName%>>  {
  createDocument(request: any): <%=SchemaName%>;
  updateDocument(<%=schemaName%>: <%=SchemaName%>, request: any): <%=SchemaName%>;
  getList(request: <%= GetListDtoName %>): Promise<any>;
  getDetail(request: <%= GetDetailDtoName %>): Promise<any>;
}
