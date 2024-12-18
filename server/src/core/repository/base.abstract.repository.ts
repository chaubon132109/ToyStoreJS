import { BaseModel } from '@core/model/base.model';
import { isEmpty } from 'class-validator';
import { first } from 'lodash';
import { FilterQuery, Model, UpdateQuery, Document } from 'mongoose';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T extends BaseModel>
  implements BaseInterfaceRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public get aggregate(): Model<T>['aggregate'] {
    return this.model.aggregate.bind(this.model);
  }

  public get bulkSave(): Model<T>['bulkSave'] {
    return this.model.bulkSave.bind(this.model);
  }

  public get countDocuments(): Model<T>['countDocuments'] {
    return this.model.countDocuments.bind(this.model);
  }

  public get deleteMany(): Model<T>['deleteMany'] {
    return this.model.deleteMany.bind(this.model);
  }

  public get distinct(): Model<T>['distinct'] {
    return this.model.distinct.bind(this.model);
  }

  public get exists(): Model<T>['exists'] {
    return this.model.exists.bind(this.model);
  }

  public get find(): Model<T>['find'] {
    return this.model.find.bind(this.model);
  }

  public get findById(): Model<T>['findById'] {
    return this.model.findById.bind(this.model);
  }

  public get findByIdAndDelete(): Model<T>['findByIdAndDelete'] {
    return this.model.findByIdAndDelete.bind(this.model);
  }

  public get findOne(): Model<T>['findOne'] {
    return this.model.findOne.bind(this.model);
  }

  public get findOneAndDelete(): Model<T>['findOneAndDelete'] {
    return this.model.findOneAndDelete.bind(this.model);
  }

  public get findOneAndUpdate(): Model<T>['findOneAndUpdate'] {
    return this.model.findOneAndUpdate.bind(this.model);
  }

  public get insertMany(): Model<T>['insertMany'] {
    return this.model.insertMany.bind(this.model);
  }

  public get deleteOne(): Model<T>['deleteOne'] {
    return this.model.deleteOne.bind(this.model);
  }

  public get updateMany(): Model<T>['updateMany'] {
    return this.model.updateMany.bind(this.model);
  }

  public get updateOne(): Model<T>['updateOne'] {
    return this.model.updateOne.bind(this.model);
  }

  public async create(data: T | any): Promise<T> {
    const created = await this.model.create(data);
    return created.toObject() as T;
  }

  public async findOneById(id: string): Promise<T | null> {
    const result = await this.model
      .findOne({
        _id: id,
        deletedAt: null,
      } as FilterQuery<T>)
      .exec();
    return result ? result.toObject() as T : null;
  }

  public async findOneByCode(code: string): Promise<T | null> {
    const result = await this.model
      .findOne({
        code: code,
        deletedAt: null,
      } as FilterQuery<T>)
      .exec();
    return result ? result.toObject() as T : null;
  }

  public async findOneByCondition(filterCondition: any): Promise<T | null> {
    const condition = filterCondition?.id
      ? {
          ...filterCondition,
          _id: filterCondition?.id,
        }
      : { ...filterCondition };
    const result = await this.model.findOne({ ...condition, deletedAt: null }).exec();
    return result ? result.toObject() as T : null;
  }

  public async findAllByCondition(
    condition: any,
    skip?: number,
    limit?: number,
  ): Promise<T[]> {
    const query = this.model.find({ ...condition, deletedAt: null });
    if (skip) {
      query.skip(skip);
    }
    if (limit) {
      query.limit(limit);
    }
    const result = await query.exec();
    return result.map(doc => doc.toObject()) as T[];
  }

  public async deleteById(id: T | any): Promise<any> {
    return await this.model.deleteOne({ _id: id, deletedAt: null });
  }

  public async findAll(): Promise<T[]> {
    const result = await this.model.find({
      deletedAt: null,
    });
    return result.map(doc => doc.toObject()) as T[];
  }

  public async findByIdAndUpdate(id: string, data: T | any): Promise<T | null> {
    const updated = await this.model.findByIdAndUpdate(
      { _id: id, deletedAt: null },
      { ...data },
      {
        new: true,
      },
    ).exec();
    return updated ? updated.toObject() as T : null;
  }

  public async updateById(id: T | any, data: T | any): Promise<void> {
    await this.model.updateOne({ _id: id, deletedAt: null }, data, {
      new: true,
    });
  }

  public async createMany(data: T[] | any[]): Promise<T[]> {
    const created = await this.model.insertMany(data);
    return created.map(doc => doc.toObject()) as T[];
  }

  public async softDelete(id: string): Promise<any> {
    return await this.model.updateOne(
      {
        _id: id,
        deletedAt: null,
      } as FilterQuery<T>,
      {
        $set: {
          deletedAt: new Date(),
        },
      } as UpdateQuery<T>,
    );
  }

  public async findAllWithPopulate(
    condition: any,
    populate: any,
    skip?: number,
    limit?: number,
    sort?: any,
  ): Promise<T[]> {
    const query = this.model
      .find({ ...condition, deletedAt: null })
      .populate(populate);
    if (skip) {
      query.skip(skip);
    }
    if (limit) {
      query.limit(limit);
    }
    if (!isEmpty(sort)) {
      query.sort(sort);
    }
    const result = await query.exec();
    return result.map(doc => doc.toObject()) as T[];
  }

  public async findOneWithPopulate(
    condition: FilterQuery<T>,
    populate: any,
  ): Promise<T | null> {
    const result = await this.model
      .findOne({ ...condition, deletedAt: null })
      .populate(populate)
      .exec();
    return result ? result.toObject() as T : null;
  }

  public async count(condition?: any): Promise<number> {
    return await this.model.count({ ...condition, deletedAt: null }).exec();
  }

  public async findAllAndUpdate(
    condition: any,
    dataUpdate: any,
    upsert = false,
  ): Promise<any> {
    return await this.model
      .updateMany({ ...condition, deletedAt: null }, dataUpdate, {
        upsert,
      })
      .exec();
  }

  public async bulkWrite(bulkOps: any): Promise<any> {
    return await this.model.bulkWrite(bulkOps);
  }

  public async deleteManyByCondition(condition: any): Promise<any> {
    return await this.model.deleteMany(condition);
  }

  public async lastRecord(
    sort: { [key: string]: 1 | -1 } = { code: -1 },
    condition = {}
  ): Promise<T | null> {
    const result = await this.model.find(condition).sort(sort).limit(1).exec();
    const firstResult = first(result);
    return firstResult ? firstResult.toObject() as T : null;
  }
}