---
to: "src/components/<%= h.fileName(name) %>/dto/request/<%= h.deleteDtoFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('DeleteDto') %>
---
<%

 ClassName = h.ClassName(name);
 DeleteDtoName = h.DeleteDtoName(name);

%>
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/core/dto/base.dto';

export class <%= DeleteDtoName %> extends BaseDto {
  @ApiProperty()
  id: string;
}
