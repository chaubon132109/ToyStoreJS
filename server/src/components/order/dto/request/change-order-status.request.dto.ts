import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class changeOrderStatusRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsOptional()
  status: number;
}
