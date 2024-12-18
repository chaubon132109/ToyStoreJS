import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class getListCartByIdsRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  ids: string;
}
