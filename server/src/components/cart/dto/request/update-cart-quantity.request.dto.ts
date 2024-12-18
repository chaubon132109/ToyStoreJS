import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class UpdateCartQuantityRequestDto extends BaseDto {
  @ApiProperty()
  cartId: string;

  @ApiProperty()
  quantity: number;
}
