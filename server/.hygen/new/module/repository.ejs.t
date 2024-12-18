---
to: "src/mongo/repository/<%= h.fileName(name) %>/<%= h.repositoryFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('Repository') %>
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
import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { <%= GetListDtoName %> } from '@components/<%= h.fileName(name) %>/dto/request/<%= getListDtoFileName %>';
import { <%= GetDetailDtoName %> } from '@components/<%= h.fileName(name) %>/dto/request/<%= getDetailDtoFileName %>';
import { <%= RepositoryNameInterface %> } from '@components/<%= h.fileName(name) %>/interface/<%= repositoryInterfaceFileName %>';
import { InjectModel } from '@nestjs/mongoose';
import { <%=SchemaName%> } from 'src/models/<%=schemaName%>/<%=schemaName%>.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model } from 'mongoose';

@Injectable()
export class <%= RepositoryName %>
 extends BaseAbstractRepository<<%=SchemaName%>>
 implements <%= RepositoryNameInterface %>
{
  constructor(
    @InjectModel(<%=SchemaName%>.name)
    private readonly <%=schemaModelName%>: Model<<%=SchemaName%>>,
  ) {
    super(<%=schemaModelName%>);
  }

  createDocument(request: any): <%=SchemaName%> {
    const <%=schemaName%> = new this.<%=schemaModelName%>();

    if (request?.id) <%=schemaName%>.id = request.id;

    <%=schemaName%>.code = request.code;
    <%=schemaName%>.name = request.name;
    <%=schemaName%>.nameEn = request.nameEn;
    <%=schemaName%>.status = request.status;
    <%=schemaName%>.description = request.description;
  
    // implement your logic here

    return <%=schemaName%>;
  }

  updateDocument(<%=schemaName%>: <%=SchemaName%>, request: any): <%=SchemaName%> {
     <%=schemaName%>.code = request.code;
     <%=schemaName%>.name = request.name;
     <%=schemaName%>.nameEn = request.nameEn;
     <%=schemaName%>.status = request.status;
     <%=schemaName%>.description = request.description;
    // implement your logic here
    return  <%=schemaName%>;
  }
  
  async getList(request: <%= GetListDtoName %>): Promise<any> {
    const {keyword, skip, take, sort, filter } = request;
    let filterObj: any = request.filterObj || {};
    let sortObj = {};

    if (keyword?.length) {
      filterObj = {
        ...filterObj,
        $or: [
          { code: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
        ],
      };
    }

    if (!isEmpty(filter)) {
        filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            }
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;    
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const sort = item.order == 'DESC' ? -1 : 1;
        switch (item.column) {
           case 'code':
            sortObj = { ...sortObj, code: sort };
            break;
          case 'name':
            sortObj = { ...sortObj, name: sort };
            break;
          case 'createdAt':
            sortObj = { ...sortObj, createdAt: sort };
            break;  
          default:
            break;
        }
      });
    }else {
      sortObj = { createdAt: -1, _id: -1 };
    }

    const data = await this.<%=schemaModelName%>
      .aggregate([])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.<%=schemaModelName%>
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count }
  }
  async getDetail(request: <%= GetDetailDtoName %>): Promise<any> {
    const { id } = request;
    const <%=schemaName%> = await this.<%=schemaName%>Schema.findById(id).exec();
    return <%=schemaName%>;
  }
}
