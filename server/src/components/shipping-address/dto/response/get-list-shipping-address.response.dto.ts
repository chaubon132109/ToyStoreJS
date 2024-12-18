import { GetDetailUserResponseDto } from '@components/user/dto/response/get-detail-user.response.dto';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetListShippingAddressResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  isDefault: boolean;

  @ApiProperty()
  @Expose()
  @Type(() => GetDetailUserResponseDto)
  user: GetDetailUserResponseDto;
}
