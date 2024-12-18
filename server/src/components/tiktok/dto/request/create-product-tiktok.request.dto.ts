import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ImageDto {
  @IsString()
  id: string;
}

class ProductCertificationFileDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type: string;
}

class ProductCertificationDto {
  @IsString()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductCertificationFileDto)
  files: ProductCertificationFileDto[];
}

class ProductAttributeDto {
  @IsString()
  attribute_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeValueDto)
  attribute_values: AttributeValueDto[];
}

class AttributeValueDto {
  @IsString()
  value_id: string;

  @IsString()
  value_name: string;
}

class SKUImageDto {
  @IsString()
  id: string;
}

class SKUSalesAttributeDto {
  @IsString()
  attribute_id: string;

  @IsString()
  attribute_name: string;

  @IsOptional()
  @IsString()
  custom_value?: string;

  @ValidateNested()
  @Type(() => SKUImageDto)
  sku_img: SKUImageDto;

  @IsString()
  value_id: string;
}

class SKUStockInfoDto {
  @IsNumber()
  available_stock: number;

  @IsString()
  warehouse_id: string;
}

class SKUDto {
  @IsArray()
  @IsString({ each: true })
  external_urls: string[];

  @IsString()
  original_price: string;

  @IsString()
  outer_sku_id: string;

  @ValidateNested()
  @Type(() => SKUSalesAttributeDto)
  product_identifier_code: SKUSalesAttributeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SKUSalesAttributeDto)
  sales_attributes: SKUSalesAttributeDto[];

  @IsString()
  seller_sku: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SKUStockInfoDto)
  stock_infos: SKUStockInfoDto[];
}

class ProductVideoDto {
  @IsString()
  video_id: string;
}

class SizeChartDto {
  @IsString()
  img_id: string;
}

export class CreateProductRequestDto {
  @IsString()
  brand_id: string;

  @IsString()
  category_id: string;

  @IsString()
  category_version: string;

  @IsString()
  delivery_service_ids: string;

  @IsString()
  description: string;

  @IsBoolean()
  is_cod_open: boolean;

  @IsString()
  outer_product_id: string;

  @IsString()
  package_dimension_unit: string;

  @IsNumber()
  package_height: number;

  @IsNumber()
  package_length: number;

  @IsNumber()
  package_weight: number;

  @IsNumber()
  package_width: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  product_attributes: ProductAttributeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductCertificationDto)
  product_certifications: ProductCertificationDto[];

  @IsString()
  product_name: string;

  @ValidateNested()
  @Type(() => ProductVideoDto)
  product_video: ProductVideoDto;

  @ValidateNested()
  @Type(() => SizeChartDto)
  size_chart: SizeChartDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SKUDto)
  skus: SKUDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
}
