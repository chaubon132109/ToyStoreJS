import { CollationOptions } from 'mongodb';

export const DEFAULT_COLLATION: CollationOptions = {
  locale: 'vi',
};
export enum APIPrefix {
  Version = 'api/v1',
}
export const LANG = {
  EN: 'en',
  VI: 'vi',
  JP: 'jp',
};
export const DEFAULT_LANG = LANG.VI;
export enum StatusEnum {
  DRAFT,
  ACTIVE,
  PAUSED,
  LOCKED,
  DELETED,
}
export const SALT_ROUNDS = 10;

export const WEBHOOK_TYPE = {
  ORDER_STARUS_CHANGED: 1,
  PRODUCT_STATUS_CHANGED: 5,
};
