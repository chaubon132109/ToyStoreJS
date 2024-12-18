import { BaseModel } from '@core/model/base.model';
import { FilterQuery, Model } from 'mongoose';

export interface BaseInterfaceRepository<T extends BaseModel> {
  get aggregate(): Model<T>['aggregate'];
  get bulkSave(): Model<T>['bulkSave'];
  // get bulkWrite(): Model<T>['bulkWrite'];
  get countDocuments(): Model<T>['countDocuments'];
  // get create(): Model<T>['create'];
  get deleteMany(): Model<T>['deleteMany'];
  // get deleteOne(): Model<T>['deleteOne'];
  get distinct(): Model<T>['distinct'];
  get exists(): Model<T>['exists'];
  get find(): Model<T>['find'];
  get findById(): Model<T>['findById'];
  get findByIdAndDelete(): Model<T>['findByIdAndDelete'];
  // get findByIdAndUpdate(): Model<T>['findByIdAndUpdate'];
  get findOne(): Model<T>['findOne'];
  get findOneAndDelete(): Model<T>['findOneAndDelete'];
  get findOneAndUpdate(): Model<T>['findOneAndUpdate'];
  get insertMany(): Model<T>['insertMany'];
  get deleteOne(): Model<T>['deleteOne'];
  get updateMany(): Model<T>['updateMany'];
  get updateOne(): Model<T>['updateOne'];
  create(data: T | any): Promise<T>;
  findOneById(id: number | string): Promise<T>;
  findOneByCondition(filterCondition: any): Promise<T>;
  findOneByCode(code: string): Promise<T>;
  findAll(): Promise<T[]>;
  findByIdAndUpdate(id: string, data: T | any): Promise<T>;
  findAllAndUpdate(
    condition: any,
    dataUpdate: any,
    upsert?: boolean,
  ): Promise<any>;
  deleteById(id: string): Promise<any>;
  updateById(id: string, data: T | any): Promise<void>;
  findAllByCondition(
    condition: any,
    skip?: number,
    limit?: number,
  ): Promise<T[]>;
  createMany(data: T | any): Promise<any>;
  softDelete(id: string): Promise<any>;
  count(condition?: any): Promise<number>;
  findAllWithPopulate(
    condition: any,
    populate: any,
    skip?: number,
    limit?: number,
    sort?: any,
  ): Promise<T[]>;
  findOneWithPopulate(condition: FilterQuery<T>, populate: any): Promise<T>;
  bulkWrite(bulkOps: any): Promise<any>;
  deleteManyByCondition(condition: any): Promise<any>;
  lastRecord(sort?: any, condition?: any): Promise<any>;
  // generateNextCode(prefixCode: string, condition?: any): Promise<string>;
  // generateNextCodeWithYear(
  //   prefixCode: string,
  //   condition?: any,
  // ): Promise<string>;
}
