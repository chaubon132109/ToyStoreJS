import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListCartRequestDto } from '@components/cart/dto/request/get-list-cart.request.dto';
import { GetDetailCartRequestDto } from '@components/cart/dto/request/get-detail-cart.request.dto';
import { CartRepositoryInterface } from '@components/cart/interface/cart.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/models/cart/cart.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';

@Injectable()
export class CartRepository
  extends BaseAbstractRepository<Cart>
  implements CartRepositoryInterface
{
  constructor(
    @InjectModel(Cart.name)
    private readonly cartSchema: Model<Cart>,
  ) {
    super(cartSchema);
  }

  createDocument(request: any): Cart {
    const cart = new this.cartSchema();

    if (request?.id) cart.id = request.id;

    cart.itemId = new Types.ObjectId(request.itemId);
    cart.userId = new Types.ObjectId(request.userId) || request.userId;
    cart.status = request.status;
    cart.quantity = request.quantity;

    // implement your logic here

    return cart;
  }

  updateDocument(cart: Cart, request: any): Cart {
    cart.itemId = request.itemId;
    cart.userId = request.userId;
    cart.status = request.status;
    cart.quantity = request.quantity;
    // implement your logic here
    return cart;
  }

  async getList(request: GetListCartRequestDto): Promise<any> {
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

    const data = await this.cartSchema
      .aggregate([
        {
          $lookup: {
            from: 'items',
            localField: 'itemId',
            foreignField: '_id',
            as: 'item',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
      ])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.cartSchema
      .aggregate([
        {
          $lookup: {
            from: 'items',
            localField: 'itemId',
            foreignField: '_id',
            as: 'item',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
      ])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailCartRequestDto): Promise<any> {
    const { id } = request;
    const cart = await this.cartSchema.findById(id).exec();
    return cart;
  }

  async getListCartByUser(request: GetListCartRequestDto): Promise<any> {
    const { userId, skip, take } = request;
    const data = await this.cartSchema
      .aggregate([
        {
          $lookup: {
            from: 'items',
            localField: 'itemId',
            foreignField: '_id',
            as: 'item',
          },
        },
        {
          $unwind: { path: '$item', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'discounts',
            localField: 'item.discountId',
            foreignField: '_id',
            as: 'discount',
          },
        },
        {
          $unwind: { path: '$discount', preserveNullAndEmptyArrays: true },
        },
        {
          $match: {
            userId: new Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'images',
            localField: 'item._id',
            foreignField: 'itemId',
            as: 'images',
          },
        },
      ])
      .skip(skip)
      .limit(take)
      .exec();

    const count = await this.cartSchema
      .aggregate([])
      .match({
        userId: new Types.ObjectId(userId),
      })
      .count('count')
      .exec();
    return { data, count };
  }
  async updateCartQuatity(cartId: string, quantity: number): Promise<any> {
    return await this.cartSchema
      .findByIdAndUpdate(
        new Types.ObjectId(cartId),
        { quantity },
        { new: true },
      )
      .exec(); // .findByIdAndUpdate(cartId, { quantity }, { new: true })
  }
  async getListCartByIds(ids: string[]): Promise<any> {
    const data = await this.cartSchema
      .aggregate([
        {
          $match: {
            _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
          },
        },
        {
          $lookup: {
            from: 'items',
            localField: 'itemId',
            foreignField: '_id',
            as: 'item',
          },
        },
        {
          $unwind: { path: '$item', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'discounts',
            localField: 'item.discountId',
            foreignField: '_id',
            as: 'discount',
          },
        },
        {
          $unwind: { path: '$discount', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'images',
            localField: 'item._id',
            foreignField: 'itemId',
            as: 'images',
          },
        },
      ])
      .exec();

    const count = await this.cartSchema
      .aggregate([])
      .match({
        id: { $in: ids },
      })
      .count('count')
      .exec();
    return { data, count };
  }
}
