import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListOrderDetailRequestDto } from '@components/order-detail/dto/request/get-list-order-detail.request.dto';
import { GetDetailOrderDetailRequestDto } from '@components/order-detail/dto/request/get-detail-order-detail.request.dto';
import { OrderDetailRepositoryInterface } from '@components/order-detail/interface/order-detail.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDetail } from 'src/models/order-detail/order-detail.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';

@Injectable()
export class OrderDetailRepository
  extends BaseAbstractRepository<OrderDetail>
  implements OrderDetailRepositoryInterface
{
  constructor(
    @InjectModel(OrderDetail.name)
    private readonly orderDetailSchema: Model<OrderDetail>,
  ) {
    super(orderDetailSchema);
  }

  createDocument(request: any): OrderDetail {
    const orderDetail = new this.orderDetailSchema();

    if (request?.id) orderDetail.id = request.id;

    orderDetail.orderId = request.orderId;
    orderDetail.itemId = new Types.ObjectId(request.itemId) || request.itemId;
    orderDetail.quantity = request.quantity;
    orderDetail.price = request.price;
    orderDetail.discountPercent = request.discount;

    // implement your logic here

    return orderDetail;
  }

  updateDocument(orderDetail: OrderDetail, request: any): OrderDetail {
    orderDetail.orderId = request.orderId;
    orderDetail.itemId = request.itemId;
    orderDetail.quantity = request.quantity;
    orderDetail.price = request.price;
    orderDetail.discountPercent = request.discountPercent;
    // implement your logic here
    return orderDetail;
  }

  async getList(request: GetListOrderDetailRequestDto): Promise<any> {
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

    const data = await this.orderDetailSchema
      .aggregate([])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.orderDetailSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailOrderDetailRequestDto): Promise<any> {
    const { id } = request;
    const orderDetail = await this.orderDetailSchema.findById(id).exec();
    return orderDetail;
  }
  async getTopSellingProducts(): Promise<any[]> {
    return await this.orderDetailSchema
      .aggregate([
        {
          $group: {
            _id: '$itemId',
            totalQuantity: { $sum: '$quantity' },
          },
        },

        {
          $sort: {
            totalQuantity: -1,
          },
        },

        {
          $limit: 5,
        },

        {
          $lookup: {
            from: 'items',
            localField: '_id',
            foreignField: '_id',
            as: 'itemDetails',
          },
        },
        {
          $unwind: '$itemDetails',
        },

        {
          $lookup: {
            from: 'discounts',
            localField: 'itemDetails.discountId',
            foreignField: '_id',
            as: 'discountDetails',
          },
        },
        {
          $unwind: {
            path: '$discountDetails',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $addFields: {
            discountPercent: '$discountDetails.percent',
            salePrice: {
              $cond: [
                { $gt: ['$discountDetails.percent', 0] },
                {
                  $subtract: [
                    '$itemDetails.price',
                    {
                      $multiply: [
                        '$itemDetails.price',
                        { $divide: ['$discountDetails.percent', 100] },
                      ],
                    },
                  ],
                },
                '$itemDetails.price',
              ],
            },
          },
        },

        {
          $project: {
            _id: 0,
            itemId: '$_id',
            totalQuantity: 1,
            discountPercent: 1,
            salePrice: 1,
            'itemDetails.name': 1,
            'itemDetails.code': 1,
            'itemDetails.price': 1,
          },
        },
      ])
      .limit(5)
      .exec();
  }
  async getTop3Selling(): Promise<any[]> {
    return await this.orderDetailSchema
      .aggregate([
        {
          $group: {
            _id: '$itemId',
            totalQuantity: { $sum: '$quantity' },
          },
        },
        {
          $sort: {
            totalQuantity: -1,
          },
        },
        {
          $limit: 8,
        },
        {
          $lookup: {
            from: 'items',
            localField: '_id',
            foreignField: '_id',
            as: 'itemDetails',
          },
        },
        {
          $unwind: '$itemDetails',
        },
        {
          $lookup: {
            from: 'discounts',
            localField: 'itemDetails.discountId',
            foreignField: '_id',
            as: 'discountDetails',
          },
        },
        {
          $unwind: {
            path: '$discountDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'images',
            localField: '_id', // itemId từ $group
            foreignField: 'itemId', // itemId trong bảng images
            as: 'imageDetails',
          },
        },
        {
          $addFields: {
            discountPercent: '$discountDetails.percent',
            salePrice: {
              $cond: [
                { $gt: ['$discountDetails.percent', 0] },
                {
                  $subtract: [
                    '$itemDetails.price',
                    {
                      $multiply: [
                        '$itemDetails.price',
                        { $divide: ['$discountDetails.percent', 100] },
                      ],
                    },
                  ],
                },
                '$itemDetails.price',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            itemId: '$_id',
            totalQuantity: 1,
            discountPercent: 1,
            salePrice: 1,
            'itemDetails.name': 1,
            'itemDetails.code': 1,
            'itemDetails.price': 1,
            imageDetails: 1, // Bao gồm thông tin ảnh
          },
        },
      ])
      .limit(8)
      .exec();
  }
  async getReportByDiscountPercent(): Promise<any> {
    return await this.orderDetailSchema.aggregate([
      {
        $group: {
          _id: '$discountPercent',
          totalQuantity: { $sum: '$quantity' },
          totalPrice: { $sum: { $multiply: ['$quantity', '$price'] } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }
}
