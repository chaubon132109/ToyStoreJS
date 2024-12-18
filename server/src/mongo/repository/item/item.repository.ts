import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListItemRequestDto } from '@components/item/dto/request/get-list-item.request.dto';
import { GetDetailItemRequestDto } from '@components/item/dto/request/get-detail-item.request.dto';
import { ItemRepositoryInterface } from '@components/item/interface/item.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from 'src/models/item/item.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';

@Injectable()
export class ItemRepository
  extends BaseAbstractRepository<Item>
  implements ItemRepositoryInterface
{
  constructor(
    @InjectModel(Item.name)
    private readonly itemSchema: Model<Item>,
  ) {
    super(itemSchema);
  }

  createDocument(request: any): Item {
    const item = new this.itemSchema();

    if (request?.id) item.id = request.id;

    item.code = request.code;
    item.name = request.name;
    item.nameEn = request.nameEn;
    item.status = request.status;
    item.description = request.description;
    item.categoryId =
      new Types.ObjectId(request.categoryId) || request.categoryId;
    item.discountId =
      new Types.ObjectId(request.discountId) || request.discountId;
    item.price = request.price;
    item.length = request.length;
    item.width = request.width;
    item.height = request.height;
    item.weight = request.weight;
    item.createdBy = request.userId;
    item.sku = request.sku;
    item.isTiktokProduct = request.isTiktokProduct;
    item.tiktokId = request.tiktokId;
    item.stockQuantity = request.stockQuantity;
    item.gender = request.gender;
    item.age = request.age;
    item.tiktokProductStatus = request.tiktokProductStatus;

    return item;
  }

  updateDocument(item: Item, request: any): Item {
    item.code = request.code;
    item.name = request.name;
    item.nameEn = request.nameEn;
    item.status = request.status;
    item.description = request.description;
    item.categoryId = request.categoryId;
    item.discountId = request.discountId;
    item.price = request.price;
    item.length = request.length;
    item.width = request.width;
    item.height = request.height;
    item.weight = request.weight;
    item.updatedBy = request.userId;
    item.sku = request.sku;
    item.stockQuantity = request.stockQuantity;
    return item;
  }

  async getList(request: GetListItemRequestDto): Promise<any> {
    const { keyword, skip, take, sort, filter } = request;
    let filterObj: any = request.filterObj || {};
    let sortObj = {};

    if (keyword?.length) {
      filterObj = {
        ...filterObj,
        $or: [
          { code: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
        ],
      };
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          case 'categoryId':
            filterObj = {
              ...filterObj,
              categoryId: new Types.ObjectId(item.text),
            };
            break;
          case 'age':
            const [minAge, maxAge] = item.text
              .split('|')
              .map((val) => val.trim());
            filterObj = {
              ...filterObj,
              age: {
                ...(minAge ? { $gte: parseInt(minAge, 10) } : {}),
                ...(maxAge ? { $lte: parseInt(maxAge, 10) } : {}),
              },
            };
            break;
          case 'gender':
            filterObj = {
              ...filterObj,
              gender: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
            break;
          case 'isDiscount':
            filterObj = {
              ...filterObj,
              discountId: {
                $ne: null,
              },
            };
            break;
          case 'isStock':
            filterObj = {
              ...filterObj,
              stockQuantity: {
                $gt: 0,
              },
            };
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const sort = item.order == 'DESC' ? -1 : 1;
        switch (item.column) {
          case 'code':
            sortObj = { ...sortObj, code: sort };
            break;
          case 'name':
            sortObj = { ...sortObj, name: sort };
            break;
          case 'createdAt':
            sortObj = { ...sortObj, createdAt: sort };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1, _id: -1 };
    }

    const data = await this.itemSchema
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'discounts',
            localField: 'discountId',
            foreignField: '_id',
            as: 'discount',
          },
        },
        {
          $lookup: {
            from: 'images',
            localField: '_id',
            foreignField: 'itemId',
            as: 'images',
          },
        },
      ])
      .unwind({ path: '$category', preserveNullAndEmptyArrays: true })
      .unwind({ path: '$discount', preserveNullAndEmptyArrays: true })
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.itemSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(id: string): Promise<any> {
    const result = await this.itemSchema.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'discounts',
          localField: 'discountId',
          foreignField: '_id',
          as: 'discount',
        },
      },
      {
        $lookup: {
          from: 'images',
          localField: '_id',
          foreignField: 'itemId',
          as: 'images',
        },
      },
      {
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$discount', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          categoryId: 0, // Exclude original categoryId
          discountId: 0, // Exclude original discountId
        },
      },
    ]);

    return result[0] || null;
  }
  async totalStock(): Promise<number> {
    const total = await this.itemSchema
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$stockQuantity' },
          },
        },
      ])
      .exec();
    return total[0]?.total || 0;
  }
  async countStockStatus(): Promise<{
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }> {
    const stockCounts = await this.itemSchema
      .aggregate([
        {
          $facet: {
            inStock: [
              { $match: { stockQuantity: { $gte: 100 } } },
              { $count: 'count' },
            ],
            lowStock: [
              { $match: { stockQuantity: { $gt: 0, $lt: 100 } } },
              { $count: 'count' },
            ],
            outOfStock: [
              { $match: { stockQuantity: { $eq: 0 } } },
              { $count: 'count' },
            ],
          },
        },
      ])
      .exec();

    return {
      inStock: stockCounts[0]?.inStock[0]?.count || 0,
      lowStock: stockCounts[0]?.lowStock[0]?.count || 0,
      outOfStock: stockCounts[0]?.outOfStock[0]?.count || 0,
    };
  }
}
