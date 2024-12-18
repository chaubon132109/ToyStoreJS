import Big from 'big.js';
// import { SortOrder } from '@constant/database.constant';
import * as moment from 'moment';
// import { REDIS_LOCK_ENUM, TIME_REDIS_LOCK_ENUM } from '@constant/common';
import { find, forEach, isEmpty, keyBy, map, omit, reduce } from 'lodash';

export const minus = (first = 0, second = 0): number => {
  return Number(new Big(first).minus(new Big(second)));
};

export const plus = (first = 0, second = 0): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export const mul = (first = 0, second = 0): number => {
  return Number(new Big(first).mul(new Big(second)));
};

export const div = (first = 0, second = 1): number => {
  return Number(new Big(first).div(new Big(second)));
};

export const getDaysArray = function (start, end) {
  const arr = [];
  for (
    let dt = new Date(start);
    dt.setHours(0, 0, 0, 0) <= new Date(end).setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

export const getDaysBetweenDates = (start, end) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate: any = new Date(start);
  const secondDate: any = new Date(end);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
};

export const truncateNumber = (number, index = 2) => {
  // cutting the number
  return +number
    .toString()
    .slice(0, number.toString().indexOf('.') + (index + 1));
};

export const validateTimeFormatHHMM = (str) => {
  const reg = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return reg.test(str);
};

export const getTimes = (time /*HH:mm*/) => {
  const [hour, minute] = time.split(':');
  return { hour: +hour, minute: +minute };
};

export const getFullDateString = (date) => {
  const dateString = new Date(date);
  const dd = String(dateString.getDate()).padStart(2, '0');
  const mm = String(dateString.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = dateString.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
};

export const checkIsSqlId = (id: number | string) => {
  return Number.isInteger(+id);
};

// export function compareFn<T>(order: SortOrder, obj1: T, obj2: T) {
//   if (order == SortOrder.Ascending) {
//     if (obj1 > obj2) return 1;

//     if (obj1 < obj2) return -1;
//   } else {
//     if (obj1 < obj2) return 1;

//     if (obj1 > obj2) return -1;
//   }

//   return 0;
// }

export function compareDate(startDate: Date, endDate: Date): boolean {
  if (startDate && endDate)
    return (
      moment(startDate).startOf('day').toDate() <
      moment(endDate).endOf('day').toDate()
    );
  return true;
}

export const isDevMode = () => {
  return (
    process.env.NODE_ENV.startsWith('dev') ||
    process.env.NODE_ENV.startsWith('local')
  );
};
// export const makeConfigLock = (type, param) => {
//   let config;
//   //Phần duration và settings sau có thể thay đổi sao cho phù hợp với từng thời gian xử lý của từng hàm
//   switch (type) {
//     case REDIS_LOCK_ENUM.CONFIRM_EXPORT:
//       return (config = {
//         keys: {
//           type: REDIS_LOCK_ENUM.CONFIRM_EXPORT,
//           param: param,
//         },
//         duration: TIME_REDIS_LOCK_ENUM.DURATION,
//         setttings: {
//           retryCount: TIME_REDIS_LOCK_ENUM.RETRY,
//           retryDelay: TIME_REDIS_LOCK_ENUM.DELAY,
//           retryJitter: TIME_REDIS_LOCK_ENUM.JITER,
//         },
//       });
//   }
// };
const SEPARATOR_CHAR = '-';
export function makePickPutKey(
  item: any,
  keys: string[],
  options?: {
    omittedKeys?: string[];
    isRequest?: boolean;
  },
) {
  if (!isEmpty(options?.omittedKeys)) {
    item = omit(item, options.omittedKeys);
  }
  const result = map(keys, (key) => {
    switch (key) {
      case 'quality':
        return item[key] ? Number(item[key]) : null;
      case 'lot':
        return item[key] ?? (item['lotNumber'] || null);
      case 'itemTypeSettingId':
        return item[key] ?? (item['itemTypeId'] || null);
      case 'level':
        return item[key]?.toString() || null;
      case 'ticketLocatorId':
        if (options?.isRequest) {
          if (!item['isLocatorSelected']) {
            return null;
          }
        }
        return item[key] || item['locatorId'] || null;
      default:
        return item[key] || null;
    }
  });
  return result.join(SEPARATOR_CHAR);
}
export function sumByKeys(
  objArr: any[],
  options: {
    keys: string[];
    quantityFields: string[];
    isKeyBy?: boolean;
  },
): any {
  const { keys, quantityFields, isKeyBy } = options;
  const result = reduce(
    objArr,
    (result, i) => {
      const key = map(keys, (key) => {
        return i[key];
      }).join('-');

      i['key'] = key;
      const existing = find(result, (j) => {
        return j['key'] === i['key'];
      });

      if (isEmpty(existing)) {
        result.push({ ...i, key });
      } else {
        forEach(quantityFields, (q) => {
          existing[q] = plus(i[q] || 0, existing[q] || 0);
        });
      }
      return result;
    },
    [],
  );

  return isKeyBy ? keyBy(result, 'key') : result;
}

export const transformObjectToFilter = (obj: any): string => {
  const filter = [];
  for (const key in obj) {
    filter.push({
      column: key,
      text: Array.isArray(obj[key])
        ? obj[key].join(',')
        : obj[key]?.toString() || obj[key],
    });
  }

  return JSON.stringify(filter);
};
