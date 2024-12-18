import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class BaseDto {
  request: any;

  responseError: any;

  user?: any;

  userId?: any;

  lang?: string;

  isMobile?: boolean;
}
