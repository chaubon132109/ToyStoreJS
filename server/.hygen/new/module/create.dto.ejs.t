---
to: "src/components/<%= h.fileName(name) %>/dto/request/<%= h.createDtoFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !blocks.includes('CreateDto') %>
---
<%

 ClassName = h.ClassName(name);
 CreateDtoName = h.CreateDtoName(name);

%>
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';


export class <%= CreateDtoName %> extends BaseDto {

  @ApiProperty()
 @IsOptional()
  code: string;

  @ApiProperty()
 @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}
