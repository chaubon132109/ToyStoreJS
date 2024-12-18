---
to: "src/components/<%= h.fileName(name) %>/dto/response/<%= h.getListResponseDtoFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('GetListResponseDto') %>
---
<%

 ClassName = h.ClassName(name);
 GetListResponseDtoName = h.GetListResponseDtoName(name);

%>
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class <%= GetListResponseDtoName %> extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;
}
