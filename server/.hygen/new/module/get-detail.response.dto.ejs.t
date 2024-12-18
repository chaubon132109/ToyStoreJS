---
to: "src/components/<%= h.fileName(name) %>/dto/response/<%= h.getDetailResponseDtoFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('GetDetailResponseDto') %>
---
<%

 ClassName = h.ClassName(name);
 GetDetailResponseDtoName = h.GetDetailResponseDtoName(name);

%>
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class <%= GetDetailResponseDtoName %> extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;
}
