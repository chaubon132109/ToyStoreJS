import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListShippingMethodRequestDto } from '@components/shipping-method/dto/request/get-list-shipping-method.request.dto';
import { GetDetailShippingMethodRequestDto } from '@components/shipping-method/dto/request/get-detail-shipping-method.request.dto';
import { ShippingMethodRepositoryInterface } from '@components/shipping-method/interface/shipping-method.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ShippingMethod } from 'src/models/shipping-method/shipping-method.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model } from 'mongoose';

@Injectable()
export class ShippingMethodRepository
  extends BaseAbstractRepository<ShippingMethod>
  implements ShippingMethodRepositoryInterface
{
  constructor(
    @InjectModel(ShippingMethod.name)
    private readonly shippingMethodSchema: Model<ShippingMethod>,
  ) {
    super(shippingMethodSchema);
  }

  createDocument(request: any): ShippingMethod {
    const shippingMethod = new this.shippingMethodSchema();

    if (request?.id) shippingMethod.id = request.id;

    shippingMethod.code = request.code;
    shippingMethod.name = request.name;
    shippingMethod.nameEn = request.nameEn;
    shippingMethod.fee = request.fee;
    shippingMethod.status = request.status;
    shippingMethod.description = request.description;

    // implement your logic here

    return shippingMethod;
  }

  updateDocument(shippingMethod: ShippingMethod, request: any): ShippingMethod {
    shippingMethod.code = request.code;
    shippingMethod.name = request.name;
    shippingMethod.nameEn = request.nameEn;
    shippingMethod.fee = request.fee;
    shippingMethod.status = request.status;
    shippingMethod.description = request.description;
    // implement your logic here
    return shippingMethod;
  }

  async getList(request: GetListShippingMethodRequestDto): Promise<any> {
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

    const data = await this.shippingMethodSchema
      .aggregate([])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.shippingMethodSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailShippingMethodRequestDto): Promise<any> {
    const { id } = request;
    const shippingMethod = await this.shippingMethodSchema.findById(id).exec();
    return shippingMethod;
  }
}
