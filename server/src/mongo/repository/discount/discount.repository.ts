import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListDiscountRequestDto } from '@components/discount/dto/request/get-list-discount.request.dto';
import { GetDetailDiscountRequestDto } from '@components/discount/dto/request/get-detail-discount.request.dto';
import { DiscountRepositoryInterface } from '@components/discount/interface/discount.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Discount } from 'src/models/discount/discount.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model } from 'mongoose';

@Injectable()
export class DiscountRepository
  extends BaseAbstractRepository<Discount>
  implements DiscountRepositoryInterface
{
  constructor(
    @InjectModel(Discount.name)
    private readonly discountSchema: Model<Discount>,
  ) {
    super(discountSchema);
  }

  createDocument(request: any): Discount {
    const discount = new this.discountSchema();

    if (request?.id) discount.id = request.id;

    discount.code = request.code;
    discount.name = request.name;
    discount.percent = request.percent;
    discount.description = request.description;
    discount.startApply = request.startApply;
    discount.endApply = request.endApply;

    // implement your logic here

    return discount;
  }

  updateDocument(discount: Discount, request: any): Discount {
    discount.code = request.code;
    discount.name = request.name;
    discount.percent = request.percent;
    discount.status = request.status;
    discount.description = request.description;
    // implement your logic here
    return discount;
  }

  async getList(request: GetListDiscountRequestDto): Promise<any> {
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

    const data = await this.discountSchema
      .aggregate([])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.discountSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailDiscountRequestDto): Promise<any> {
    const { id } = request;
    const discount = await this.discountSchema.findById(id).exec();
    return discount;
  }
}
