// import {
//   AttributeCode,
//   CodeEnumTemplateReceiptExport,
//   CodeEnumTemplateReceiptImport,
//   CodeEnumTemplateRequestExport,
//   CodeEnumTemplateRequestImport,
//   CodeEnumTemplateTransfer,
//   CodeEnumTemplateTransferRequest,
//   REGEX_FOR_FILTER,
// } from '@constant/common';
// import { FileUpload } from '@core/dto/file-upload.request.dto';
import Big from 'big.js';
import { isArray, isNaN, keyBy, replace, uniq } from 'lodash';
// import { AttributeValue } from 'src/models/request-order/request-order.model';
// import { JOIN_FILTER_SEPARATOR } from './constant';
// import { PaginationQuery } from './dto/request/pagination.query';
// import { TransformObjectToAttributesType } from './dto/types/transform-object-to-attributes.type';
// import { AttributeValueRequestDto } from '@components/request-order/dto/request/create-request-order.request.dto';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export const minus = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).minus(new Big(cur))));
};

export const plus = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).plus(new Big(cur))));
};

export const mul = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).mul(new Big(cur))));
};

export const div = (...arr: number[]): number => {
  return arr.reduce((total, cur) => Number(new Big(total).div(new Big(cur))));
};

export const decimal = (x: number, y: number): number => {
  const mathOne = Number(new Big(10).pow(Number(new Big(x).minus(new Big(y)))));
  const mathTwo = Number(new Big(10).pow(Number(new Big(y).mul(new Big(-1)))));
  return Number(mathOne - mathTwo);
};

export const escapeCharForSearch = (str: string): string => {
  return str.toLowerCase().replace(/[?%\\_]/gi, function (x) {
    return '\\' + x;
  });
};

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const convertArrayToMap = (array, key: string[]) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    const keyBuilt = key.reduce((res, i) => {
      return `${res}_${item[i]}`;
    }, '');
    return {
      ...obj,
      [keyBuilt]: item,
    };
  }, initialValue);
};

export const convertInputToInt = (str: any): number => {
  const number = Number(str);
  if (isNaN(number) || number - parseInt(str) !== 0) {
    return 0;
  }
  return number;
};

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

// export const convertToOrderCondition = (
//   paging: PaginationQuery,
//   keys: string[],
// ): any => {
//   const sorts = {};
//   if (paging.sort && isArray(paging.sort)) {
//     paging.sort.forEach((sort) => {
//       if (!keys.includes(sort.column)) return;
//       sorts[sort.column] = sort.order;
//     });
//   }
//   return sorts;
// };

// export const convertToSkip = (paging: PaginationQuery): number => {
//   const page = (Number(paging.page) || 1) - 1;
//   const take = convertToTake(paging);
//   return (page < 0 ? 0 : page) * take;
// };

// export const convertToTake = (paging: PaginationQuery): number => {
//   const limit = Number(paging.limit) || 10;
//   return limit > 0 && limit <= 200 ? limit : 10;
// };

// export const distinctArray = (arr: number[]): number[] => {
//   return uniq(arr.filter((e) => e));
// };

// export const serilizeData = (arrData: number[], column: string): number[] => {
//   if (arrData.length > 0) {
//     const serilize = [];
//     arrData.forEach((record) => {
//       serilize[record[column]] = record;
//     });

//     return serilize;
//   }

//   return arrData;
// };

// export const convertOrderMongo = (orderText: string): number => {
//   if (orderText.toLowerCase() === 'desc') return -1;
//   return 1;
// };

// export const dynamicSort = (property) => {
//   let sortOrder = 1;
//   if (property[0] === '-') {
//     sortOrder = -1;
//     property = property.substr(1);
//   }
//   return function (a, b) {
//     const result =
//       a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
//     return result * sortOrder;
//   };
// };

// export const paginate = (
//   unPaginatedList: any[],
//   limit: number,
//   page: number,
// ): any[] => unPaginatedList.slice((page - 1) * limit, page * limit);

// export const getDataDuplicate = (array: any[]): any => {
//   return array.filter((value, index, arr) => {
//     return arr.indexOf(value) !== index;
//   });
// };

// export const mergePayload = (param: any, body: any): any => {
//   const keys = [...new Set([...Object.keys(param), ...Object.keys(body)])];
//   const payload: any = {};
//   keys.forEach((key) => {
//     payload[key] = {
//       ...param[key],
//       ...body[key],
//     };
//   });

//   return payload;
// };

// export const getRegexByValue = (value: string) => {
//   return {
//     $regex: '.*' + replace(value, REGEX_FOR_FILTER, (e) => `\\${e}`) + '.*',
//     $options: 'i',
//   };
// };

// export const getFileSize = (file: FileUpload) => {
//   return file?.data?.byteLength || 0;
// };

// export const validateFileSizes = (files: FileUpload[], maxSizeFile: number) => {
//   return files.every((file) => {
//     return minus(getFileSize(file), maxSizeFile) <= 0;
//   });
// };

// export const generatedKey = (...arr: any[]): string => {
//   return arr.join('_');
// };

// export function exchangeQuantityUnit(
//   targetUnit: { itemUnitId: number; quantity: number },
//   sourceUnits: { id: number; isPrimaryUnit: boolean; conversionRate: number }[],
// ): { mainQuantity: number; subQuantity: number } {
//   const { itemUnitId, quantity } = targetUnit;
//   const subUnit = sourceUnits.find((unit) => !unit.isPrimaryUnit);
//   const mainUnit = sourceUnits.find((unit) => unit.isPrimaryUnit);

//   const mainQuantity =
//     itemUnitId === mainUnit?.id
//       ? quantity
//       : subUnit?.conversionRate && mainUnit?.conversionRate && quantity
//       ? mul(div(quantity, subUnit.conversionRate), mainUnit.conversionRate)
//       : 0;
//   const subQuantity =
//     itemUnitId === subUnit?.id
//       ? quantity
//       : subUnit?.conversionRate && mainUnit?.conversionRate && quantity
//       ? mul(div(quantity, mainUnit.conversionRate), subUnit.conversionRate)
//       : 0;

//   return { mainQuantity, subQuantity };
// }

// export function convertQuantity(quantity?: number): number {
//   return quantity < 0 ? 0 : quantity;
// }

// export function getOrderCodeByRequestCode(code: string): string {
//   if (code.startsWith('YN'))
//     for (const key in CodeEnumTemplateRequestImport) {
//       if (CodeEnumTemplateRequestImport[key] === code) {
//         return CodeEnumTemplateReceiptImport[key.replace('Y', '')];
//       }
//     }
//   else if (code.startsWith('YX')) {
//     for (const key in CodeEnumTemplateRequestExport) {
//       if (CodeEnumTemplateRequestExport[key] === code) {
//         return CodeEnumTemplateReceiptExport[key.replace('Y', '')];
//       }
//     }
//   } else if (code.startsWith('YC')) {
//     for (const key in CodeEnumTemplateTransferRequest) {
//       if (CodeEnumTemplateTransferRequest[key] === code) {
//         return CodeEnumTemplateTransfer[key.replace('Y', '')];
//       }
//     }
//   }

//   return null;
// }

// export function transformObjectToFilter(obj: {
//   [key: string]: any;
// }): { column: string; text: any }[] {
//   const filter: { column: string; text: any }[] = [];
//   for (const key in obj) {
//     const text = isArray(obj[key])
//       ? obj[key].join(JOIN_FILTER_SEPARATOR)
//       : obj[key];
//     filter.push({ column: key, text: text });
//   }

//   return filter;
// }

// export function transformObjectToAttribute(
//   request: TransformObjectToAttributesType,
//   attributeForms: AttributeResponse[],
// ): AttributeValue[] {
//   const attributeValues = attributeForms.map((attributeForm) => {
//     const attribute = attributeForm.attribute;
//     const attributeValue: AttributeValue = {
//       attributeId: attribute.id,
//       code: attribute.code,
//       value: null,
//     };
//     switch (attribute.code) {
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.STATUS:
//         attributeValue.value = request.status;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.CREATED_BY:
//         attributeValue.value = request.createdBy;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.CREATED_AT:
//         attributeValue.value = request.createdAt;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.CODE:
//         attributeValue.value = request.code;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.TEMPLATE_CODE:
//         attributeValue.value = request.templateCode;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_COST_CENTER_IMPORT:
//         attributeValue.value = request.costCenterImportId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_SOURCE:
//         attributeValue.value = request.source;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_PO_NUMBER:
//         attributeValue.value = request.purchaseOrderId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_VENDOR:
//         attributeValue.value = request.vendorId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_SUPPLIER:
//         attributeValue.value = request.supplierId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_APPLY_FEE:
//         attributeValue.value = request.isApplyFee;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.DESCRIPTION:
//         attributeValue.value = request.description;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WAREHOUSE_IMPORT_CODE:
//         attributeValue.value = request.warehouseImportId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.ITEM_CODE:
//         attributeValue.value = request.itemId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.ITEM_NAME:
//         attributeValue.value = request.warehouseImportId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_ITEM_TYPE_SETTING:
//         attributeValue.value = request.itemTypeSettingId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_QUANTITY_MAIN_UNIT:
//         attributeValue.value = request.requestMainQuantity;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_QUANTITY_SUB_UNIT:
//         attributeValue.value = request.requestSubQuantity;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_GENERAL_PRICE:
//         attributeValue.value = request.price;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_CURRENCY_TYPE:
//         attributeValue.value = request.currencyId;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.AMOUNT:
//         attributeValue.value = request.amount;
//         break;
//       case WAREHOUSE_REQUEST_ORDER_FIELD_CODE.WMSX_LOCATOR:
//         attributeValue.value = request.locatorId;
//         break;
//       default:
//         break;
//     }
//     return attributeValue;
//   });

//   return attributeValues;
// }

// export function refillAttributesByTemplate(
//   requestAttributes: AttributeValueRequestDto[],
//   templateAttributes: AttributeResponse[],
// ): AttributeValue[] {
//   const requestAttributeMap = keyBy(requestAttributes, 'code');
//   const attributeValues: AttributeValue[] = templateAttributes.map(
//     (templateAttribute) => {
//       const attribute = templateAttribute.attribute;

//       return {
//         attributeId: attribute.id,
//         code: attribute.code,
//         value: requestAttributeMap[attribute.code]?.value ?? null,
//       };
//     },
//   );

//   return attributeValues;
// }

// export function extractAttributeValues<T = any>(
//   attributes: { code: any; value: any }[],
//   cls?: ClassConstructor<T>,
// ): T {
//   const item: any = {};
//   attributes.forEach((attribute) => {
//     switch (attribute.code) {
//       // header
//       case AttributeCode.WMSX_STATUS:
//         item['status'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_DETAIL_ID:
//         item['requestDetailId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_CREATED_BY:
//         item['createdBy'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_CREATED_AT:
//         item['createdAt'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_CODE:
//         item['code'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_TEMPLATE_CODE:
//         item['template'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_COST_CENTER:
//       case AttributeCode.WMSX_COST_CENTER_IMPORT:
//       case AttributeCode.WMSX_COST_CENTER_EXPORT:
//         item['costCenterId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_RESOURCE:
//         item['resource'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_IS_EXPORTED:
//         item['isExportFromScene'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_IS_IMPORTED:
//         item['isImported'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_APPLY_FEE:
//         item['isApplyFee'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_GEN_PACKING_AND_INVOICE:
//         item['isGenPackingAndInvoice'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_MO_SELECT:
//         item['moId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_SUPPLIER:
//         item['supplierId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_NO_PR:
//         item['purchaseRequestId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_DESCRIPTION:
//         item['description'] = attribute.value;
//         break;

//       // detail
//       case AttributeCode.WMSX_WAREHOUSE_EXPORT_CODE:
//         item['warehouseExportId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_WAREHOUSE_IMPORT_CODE:
//         item['warehouseImportId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_ITEM_CODE:
//         item['itemId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_ITEM_CODE_PR:
//         item['itemPrId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_ITEM_TYPE_SETTING:
//         item['itemTypeId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_LOT_NUMBER:
//         item['lotNumber'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_BOM_VERSION:
//         item['bomVersionId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUALITY:
//       case AttributeCode.WMSX_QUALITY_SELECT:
//         item['quality'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_AVAILABLE_QUANTITY_MAIN_UNIT:
//         item['mainAvailableQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_AVAILABLE_QUANTITY_SUB_UNIT:
//         item['subAvailableQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_QUANTITY_MAIN_UNIT:
//       case AttributeCode.WMSX_REQUEST_QUANTITY:
//         item['mainRequestQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_QUANTITY_SUB_UNIT:
//         item['subRequestQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_REAL_MAIN_UNIT:
//       case AttributeCode.WMSX_QUANTITY_ACTUAL:
//         item['mainActualQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_REAL_SUB_UNIT:
//         item['subActualQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_ALLOCATION_MAIN_UNIT:
//         item['mainAllocateQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_ALLOCATION_SUB_UNIT:
//         item['subAllocateQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_PRICE:
//         item['price'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_AMOUNT:
//         item['amount'] = attribute.value;
//         break;
//       default:
//         break;
//     }
//   });

//   if (!cls) return item as T;
//   return plainToInstance(cls, item, { excludeExtraneousValues: true });
// }
// export function extractAttributeValue<T = any>(
//   attributes: AttributeValue[],
//   cls?: ClassConstructor<T>,
// ): T | any {
//   const item: any = {};
//   attributes.forEach((attribute) => {
//     switch (attribute.code) {
//       case AttributeCode.WMSX_STATUS:
//         item['status'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_DETAIL_ID:
//         item['requestDetailId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_CREATED_BY:
//         item['createdBy'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_CREATED_AT:
//         item['createdAt'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_CODE:
//         item['code'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_TEMPLATE_CODE:
//         item['template'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_COST_CENTER:
//         item['costCenterId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_RESOURCE:
//         item['resource'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_IS_EXPORTED:
//         item['isExported'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_IS_IMPORTED:
//         item['isImported'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_APPLY_FEE:
//         item['isApplyFee'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_GEN_PACKING_AND_INVOICE:
//         item['isGenPackingAndInvoice'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_DESCRIPTION:
//         item['description'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_WAREHOUSE_EXPORT_CODE:
//         item['warehouseExportId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_WAREHOUSE_IMPORT_CODE:
//         item['warehouseImportId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_ITEM_CODE:
//         item['itemId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_ITEM_TYPE_SETTING:
//         item['itemTypeId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_LOT_NUMBER:
//         item['lotNumber'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_BOM_VERSION:
//         item['bomVersionId'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUALITY_SELECT:
//         item['quality'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_AVAILABLE_QUANTITY_MAIN_UNIT:
//         item['mainAvailableQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_AVAILABLE_QUANTITY_SUB_UNIT:
//         item['subAvailableQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_QUANTITY_MAIN_UNIT:
//       case AttributeCode.WMSX_REQUEST_QUANTITY:
//         item['mainRequestQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_REQUEST_QUANTITY_SUB_UNIT:
//         item['subRequestQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_REAL_MAIN_UNIT:
//       case AttributeCode.WMSX_QUANTITY_ACTUAL:
//         item['mainActualQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_REAL_SUB_UNIT:
//         item['subActualQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_ALLOCATION_MAIN_UNIT:
//         item['mainAllocateQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_QUANTITY_ALLOCATION_SUB_UNIT:
//         item['subAllocateQuantity'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_PRICE:
//         item['price'] = attribute.value;
//         break;
//       case AttributeCode.WMSX_AMOUNT:
//         item['amount'] = attribute.value;
//         break;
//       default:
//         break;
//     }
//   });

//   if (!cls) return item;
//   return plainToInstance(cls, item, { excludeExtraneousValues: true });
// }
