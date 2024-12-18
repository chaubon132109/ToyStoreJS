import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/user/user.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';
import { GetDetailUserRequestDto } from '@components/user/dto/request/get-detail-user.request.dto';
import * as bcrypt from 'bcrypt';
import { StatusEnum } from '@constant/common';
import { USER_ROLE } from '@components/user/user.constant';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  createEntity(request: any): User {
    const user = new this.userModel();
    user.code = request.code;
    user.name = request.name;
    user.nameEn = request.nameEn;
    user.status = StatusEnum.ACTIVE;
    user.description = request.description;
    user.username = request.username;
    user.password = request.password;
    user.role = request.role;
    user.dob = request.dob;
    user.phone = request.phone;
    user.email = request.email;
    user.gender = request.gender;
    // implement your logic here
    return user;
  }

  updateDocument(user: User, request: any): User {
    user.code = request.code;
    user.name = request.name;
    user.nameEn = request.nameEn;
    user.status = request.status;
    user.description = request.description;
    user.username = request.username;
    user.password = request.password;
    user.role = request.role;
    return user;
  }

  async getList(request: GetListUserRequestDto): Promise<any> {
    const { keyword, skip, take, sort, filter } = request;
    let filterObj: any = request.filterObj || {};
    let sortObj = {};

    if (keyword?.length) {
      filterObj = {
        ...filterObj,
        $or: [
          { username: { $regex: `.*${keyword}.*`, $options: 'i' } },
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

    const data = await this.userModel
      .aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'userId',
            as: 'orders',
          },
        },
        {
          $addFields: {
            countOrder: { $size: '$orders' },
            totalAmount: { $sum: '$orders.totalAmount' },
          },
        },
        {
          $project: {
            orders: 0,
          },
        },
      ])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();

    const count = await this.userModel
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailUserRequestDto): Promise<any> {
    const { id } = request;
    const user = await this.userModel
      .aggregate([
        {
          $lookup: {
            from: 'shippingAddresses',
            localField: '_id',
            foreignField: 'userId',
            as: 'shippingAddresses',
          },
        },
        {
          $addFields: {
            defaultAddress: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$shippingAddresses',
                    as: 'address',
                    cond: { $eq: ['$$address.isDefault', true] },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $match: { _id: new Types.ObjectId(id) },
        },
      ])
      .exec();
    return user[0];
  }

  async checkLogin(user, password): Promise<any> {
    return await bcrypt.compare(password, user.password);
  }
  async countCustomer(): Promise<any> {
    return await this.userModel.countDocuments({ role: USER_ROLE.USER });
  }
}
