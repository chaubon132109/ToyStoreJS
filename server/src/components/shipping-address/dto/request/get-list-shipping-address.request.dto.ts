import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from '@utils/pagination.query';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetListShippingAddressRequestDto extends PaginationQuery {
  @IsOptional()
  filterObj: any;
}
