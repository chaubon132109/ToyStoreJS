import { BaseDto } from '@core/dto/base.dto';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsMongoId,
  IsEmpty,
  ValidateIf,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class CreateItemRequestDto {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  categoryId?: ObjectId;

  @IsMongoId()
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  discountId?: ObjectId;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsBoolean()
  @IsOptional()
  isTiktokProduct?: boolean;

  @IsBoolean()
  @IsOptional()
  tiktokId?: boolean;

  @IsNumber()
  @IsOptional()
  stockQuantity?: number;
}

export class CreateFormItemRequestDto extends BaseDto {
  @IsOptional()
  @Expose()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  item: CreateItemRequestDto;

  @IsOptional()
  images: any[];
}
