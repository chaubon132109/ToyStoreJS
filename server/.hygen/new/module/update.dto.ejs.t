---
to: "src/components/<%= h.fileName(name) %>/dto/request/<%= h.updateDtoFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('UpdateDto') %>
---
<%
CreateDtoName = h.CreateDtoName(name);
UpdateDtoName = h.UpdateDtoName(name);

UpdateDtoName = h.UpdateDtoName(name);
createDtoFileName = h.createDtoFileName(name);
%>

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

import { BaseDto } from '@core/dto/base.dto';
import { <%= CreateDtoName %> } from './<%= createDtoFileName %>';

export class <%= UpdateDtoName %> extends <%= CreateDtoName %> {
  @ApiProperty()
  @IsOptional()
  id?: string;
}
