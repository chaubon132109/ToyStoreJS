import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

class Data {
  @IsOptional()
  product_id: string;
}

export class WebhookRequestDto {
  @IsOptional()
  type: number;

  @IsOptional()
  tts_notification_id: string;

  @IsOptional()
  shop_id: string;

  @IsOptional()
  timestamp: string;

  @IsOptional()
  @Type(() => Data)
  data: Data;
}
