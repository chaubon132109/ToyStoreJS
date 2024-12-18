import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListShippingAddressRequestDto } from '@components/shipping-address/dto/request/get-list-shipping-address.request.dto';
import { GetDetailShippingAddressRequestDto } from '@components/shipping-address/dto/request/get-detail-shipping-address.request.dto';
import { ShippingAddressRepositoryInterface } from '@components/shipping-address/interface/shipping-address.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ShippingAddress } from 'src/models/shipping-address/shipping-address.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';

@Injectable()
export class ShippingAddressRepository
  extends BaseAbstractRepository<ShippingAddress>
  implements ShippingAddressRepositoryInterface
{
  constructor(
    @InjectModel(ShippingAddress.name)
    private readonly shippingAddressSchema: Model<ShippingAddress>,
  ) {
    super(shippingAddressSchema);
  }

  createDocument(request: any): ShippingAddress {
    const shippingAddress = new this.shippingAddressSchema();

    if (request?.id) shippingAddress.id = request.id;

    shippingAddress.userId = new Types.ObjectId(request.userId);
    shippingAddress.address = request.address;
    shippingAddress.name = request.name;
    shippingAddress.phone = request.phone;
    shippingAddress.isDefault = request.isDefault;
    // implement your logic here

    return shippingAddress;
  }

  updateDocument(
    shippingAddress: ShippingAddress,
    request: any,
  ): ShippingAddress {
    shippingAddress.userId = request.userId;
    shippingAddress.address = request.address;
    shippingAddress.isDefault = request.isDefault;
    // implement your logic here
    return shippingAddress;
  }

  async getList(request: GetListShippingAddressRequestDto): Promise<any> {
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

    const data = await this.shippingAddressSchema
      .aggregate()
      .lookup({
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      })
      .unwind({ path: '$user', preserveNullAndEmptyArrays: true })
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.shippingAddressSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailShippingAddressRequestDto): Promise<any> {
    const { id } = request;
    const shippingAddress = await this.shippingAddressSchema
      .findById(id)
      .populate('userId')
      .exec();
    return shippingAddress;
  }
}
