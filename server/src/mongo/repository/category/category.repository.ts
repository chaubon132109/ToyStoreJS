import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListCategoryRequestDto } from '@components/category/dto/request/get-list-category.request.dto';
import { GetDetailCategoryRequestDto } from '@components/category/dto/request/get-detail-category.request.dto';
import { CategoryRepositoryInterface } from '@components/category/interface/category.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/models/category/category.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepository
  extends BaseAbstractRepository<Category>
  implements CategoryRepositoryInterface
{
  constructor(
    @InjectModel(Category.name)
    private readonly categorySchema: Model<Category>,
  ) {
    super(categorySchema);
  }

  createDocument(request: any): Category {
    const category = new this.categorySchema();

    if (request?.id) category.id = request.id;

    category.code = request.code;
    category.name = request.name;
    category.nameEn = request.nameEn;
    category.description = request.description;
    category.createdBy = request.userId;
    category.source = request.source;

    // implement your logic here

    return category;
  }

  updateDocument(category: Category, request: any): Category {
    category.code = request.code;
    category.name = request.name;
    category.nameEn = request.nameEn;
    category.status = request.status;
    category.description = request.description;
    category.source = request.source;
    // implement your logic here
    return category;
  }

  async getList(request: GetListCategoryRequestDto): Promise<any> {
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
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const sort = item.order == 'ASC' ? 1 : -1;
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

    const data = await this.categorySchema
      .aggregate([
        { $match: filterObj },
        { $sort: sortObj },
        {
          $lookup: {
            from: 'items',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'items',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
          },
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            totalStockQuantity: { $sum: '$items.stockQuantity' },
            minPrice: { $min: '$items.price' },
            maxPrice: { $max: '$items.price' },
          },
        },
        { $project: { items: 0 } },
        { $skip: skip },
        { $limit: take },
      ])
      .exec();
    const count = await this.categorySchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailCategoryRequestDto): Promise<any> {
    const { id } = request;
    const category = await this.categorySchema.findById(id).exec();
    return category;
  }
}
