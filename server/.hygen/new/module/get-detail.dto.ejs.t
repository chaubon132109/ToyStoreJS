---
to: "src/components/<%= h.fileName(name) %>/dto/request/<%= h.getDetailDtoFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('GetDetailDto') %>
---
<%

 ClassName = h.ClassName(name);
 GetDetailDtoName = h.GetDetailDtoName(name);

%>
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/core/dto/base.dto';

export class <%= GetDetailDtoName %> extends BaseDto {
  @ApiProperty()
  id: string;
}
