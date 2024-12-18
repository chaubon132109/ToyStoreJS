import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListOrderRequestDto } from '@components/order/dto/request/get-list-order.request.dto';
import { GetDetailOrderRequestDto } from '@components/order/dto/request/get-detail-order.request.dto';
import { OrderRepositoryInterface } from '@components/order/interface/order.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/models/order/order.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';
import { CreateOrderRequestDto } from '@components/order/dto/request/create-order.request.dto';

@Injectable()
export class OrderRepository
  extends BaseAbstractRepository<Order>
  implements OrderRepositoryInterface
{
  constructor(
    @InjectModel(Order.name)
    private readonly orderSchema: Model<Order>,
  ) {
    super(orderSchema);
  }

  createDocument(request: CreateOrderRequestDto): Order {
    const order = new this.orderSchema();
    order.code = request.code;
    order.userId = new Types.ObjectId(request.userId) || request.userId;
    order.shipingMethodId = new Types.ObjectId(request.shipingMethodId);
    order.shipingAddressId = new Types.ObjectId(request.shipingAddressId);
    order.shippingFee = request.shippingFee;
    order.orderAt = new Date();
    order.paymentMethod = request.paymentMethod;
    order.totalAmount = request.totalAmount + request.shippingFee;
    order.productCount = request.orderDetails?.length;

    // implement your logic here

    return order;
  }

  updateDocument(order: Order, request: any): Order {
    order.userId = request.userId;
    order.shipingMethodId = request.shipingMethodId;
    order.shipingAddressId = request.shippingAddressId;
    order.shippingFee = request.shippingFee;
    order.status = request.status;
    // implement your logic here
    return order;
  }

  async getList(request: GetListOrderRequestDto): Promise<any> {
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
          case 'createdAt':
            sortObj = { ...sortObj, createdAt: sort };
            break;
          default:
            sortObj = { ...sortObj, createdAt: sort };
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1, _id: -1 };
    }

    const data = await this.orderSchema
      .aggregate([
        {
          $lookup: {
            from: 'orderDetails',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderDetails',
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
        {
          $lookup: {
            from: 'shippingAddresses',
            localField: 'shipingAddressId',
            foreignField: '_id',
            as: 'shippingAddress',
          },
        },
        {
          $lookup: {
            from: 'shippingMethods',
            localField: 'shipingMethodId',
            foreignField: '_id',
            as: 'shippingMethod',
          },
        },
        {
          $project: { orderDetails: 0 },
        },
      ])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();

    const count = await this.orderSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailOrderRequestDto): Promise<any> {
    const { id } = request;

    const order = await this.orderSchema
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'order-details',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderDetails',
          },
        },
        {
          $unwind: {
            path: '$orderDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'items',
            localField: 'orderDetails.itemId',
            foreignField: '_id',
            as: 'orderDetails.item',
          },
        },
        {
          $unwind: {
            path: '$orderDetails.item',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'images',
            localField: 'orderDetails.item._id',
            foreignField: 'itemId',
            as: 'orderDetails.item.images',
          },
        },
        {
          $lookup: {
            from: 'shippingAddresses',
            localField: 'shipingAddressId',
            foreignField: '_id',
            as: 'shippingAddress',
          },
        },
        {
          $unwind: {
            path: '$shippingAddress',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            code: { $first: '$code' },
            userId: { $first: '$userId' },
            tiktokOrderId: { $first: '$tiktokOrderId' },
            status: { $first: '$status' },
            paymentStatus: { $first: '$paymentStatus' },
            shipingMethodId: { $first: '$shipingMethodId' },
            shipingAddressId: { $first: '$shipingAddressId' },
            shipingAddress: { $first: '$shippingAddress' },
            shippingFee: { $first: '$shippingFee' },
            orderAt: { $first: '$orderAt' },
            paymentMethod: { $first: '$paymentMethod' },
            totalAmount: { $first: '$totalAmount' },
            orderDetails: { $push: '$orderDetails' },
          },
        },
      ])
      .exec();
    return order[0]; // Since aggregate returns an array, get the first document
  }
  async getOrderByUserId(userId: string): Promise<any> {
    const orders = await this.orderSchema
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'order-details',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderDetails',
          },
        },
        {
          $unwind: {
            path: '$orderDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'items',
            localField: 'orderDetails.itemId',
            foreignField: '_id',
            as: 'orderDetails.item',
          },
        },
        {
          $unwind: {
            path: '$orderDetails.item',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'images',
            localField: 'orderDetails.item._id',
            foreignField: 'itemId',
            as: 'orderDetails.item.images',
          },
        },
        {
          $group: {
            _id: '$_id',
            userId: { $first: '$userId' },
            status: { $first: '$status' },
            paymentStatus: { $first: '$paymentStatus' },
            shippingMethodId: { $first: '$shippingMethodId' },
            shippingAddressId: { $first: '$shippingAddressId' },
            shippingFee: { $first: '$shippingFee' },
            orderAt: { $first: '$orderAt' },
            paymentMethod: { $first: '$paymentMethod' },
            totalAmount: { $first: '$totalAmount' },
            orderDetails: { $push: '$orderDetails' },
          },
        },
        {
          $sort: {
            orderAt: -1,
          },
        },
      ])
      .exec();

    const report = await this.orderSchema
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId('671909e5ed27b46359b5b83e'),
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            status: '$_id',
            count: 1,
          },
        },
      ])
      .exec();
    return { orders, report };
  }
  async getTotalAmountToday(request: any): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.orderSchema
      .aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalAmount' }, // Cộng dồn trường totalAmount
          },
        },
      ])
      .exec();

    return orders[0]?.totalAmount || 0;
  }
  async countOrder(): Promise<number> {
    const count = await this.orderSchema.countDocuments().exec();
    return count;
  }

  async sumTotalAmountByMonth(): Promise<any> {
    const result = await this.orderSchema
      .aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date('2024-01-01'),
              $lte: new Date('2024-12-31'),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            revenue: { $sum: '$totalAmount' },
          },
        },
        {
          $project: {
            _id: 0,
            month: '$_id.month',
            year: '$_id.year',
            revenue: 1,
          },
        },
      ])
      .exec();

    return result || [];
  }
  async countOrdersByStatus(): Promise<{ [key: string]: number }> {
    const orderCounts = await this.orderSchema
      .aggregate([
        {
          $group: {
            _id: '$status', // Nhóm theo trường `status`
            count: { $sum: 1 }, // Đếm số lượng
          },
        },
      ])
      .exec();

    // Chuyển kết quả từ dạng `_id` thành một object dễ sử dụng
    const result: { [key: string]: number } = {};
    orderCounts.forEach((item) => {
      result[item._id] = item.count;
    });

    return result;
  }
  // Truy vấn từ MongoDB để lấy dữ liệu order và sản phẩm
  async getProductCoOccurrence(): Promise<any> {
    return await this.orderSchema
      .aggregate([
        {
          $group: {
            _id: '$orderId', // Gom nhóm theo orderId
            items: { $push: '$itemId' }, // Tạo danh sách các sản phẩm trong order
          },
        },
        {
          $unwind: '$items', // Duyệt từng sản phẩm
        },
        {
          $lookup: {
            from: 'order-details', // Liên kết lại với order-details để tìm các sản phẩm khác trong cùng order
            localField: 'items',
            foreignField: 'itemId',
            as: 'relatedProducts',
          },
        },
        {
          $unwind: '$relatedProducts',
        },
        {
          $group: {
            _id: { productA: '$items', productB: '$relatedProducts.itemId' },
            count: { $sum: 1 }, // Đếm số lần 2 sản phẩm xuất hiện cùng nhau
          },
        },
        {
          $match: { '_id.productA': { $ne: '$_id.productB' } }, // Loại bỏ trường hợp cùng một sản phẩm
        },
        {
          $sort: { count: -1 }, // Sắp xếp theo mức độ liên quan
        },
      ])
      .exec();
  }
}
