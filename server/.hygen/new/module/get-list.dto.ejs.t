---
to: "src/components/<%= h.fileName(name) %>/dto/request/<%= h.getListDtoFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('GetListDto') %>
---
<%

 ClassName = h.ClassName(name);
 GetListDtoName = h.GetListDtoName(name);

%>
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@utils/pagination.query';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetList<%= ClassName %>RequestDto extends PaginationQuery {
  @IsOptional()
  filterObj: any;
}
