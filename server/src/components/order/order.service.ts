import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { compact, uniq, isEmpty, map, forEach, find, keyBy } from 'lodash';

import { ResponseBuilder } from '@utils/response-builder';
import { PagingResponse } from '@utils/paging.response';

import { OrderServiceInterface } from './interface/order.service.interface';
import { OrderRepositoryInterface } from './interface/order.repository.interface';

import { GetListOrderRequestDto } from './dto/request/get-list-order.request.dto';
import { GetDetailOrderRequestDto } from './dto/request/get-detail-order.request.dto';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { UpdateOrderRequestDto } from './dto/request/update-order.request.dto';
import { DeleteOrderRequestDto } from './dto/request/delete-order.request.dto';

import { GetListOrderResponseDto } from './dto/response/get-list-order.response.dto';
import { GetDetailOrderResponseDto } from './dto/response/get-detail-order.response.dto';

import { ResponseCodeEnum } from '@constant/response-code.enum';
import { OrderDetailRepositoryInterface } from '@components/order-detail/interface/order-detail.repository.interface';
import { CartRepositoryInterface } from '@components/cart/interface/cart.repository.interface';
import { Model, Types } from 'mongoose';
import { ItemRepositoryInterface } from '@components/item/interface/item.repository.interface';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { TiktokServiceInterface } from '@components/tiktok/interface/tiktok.service.interface';
import { OrderStatus, PaymentMethodEnum } from './order.constant';
import { Order } from 'src/models/order/order.schema';
import { OrderDetail } from 'src/models/order-detail/order-detail.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ShippingMethodRepositoryInterface } from '@components/shipping-method/interface/shipping-method.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { ShippingAddressRepositoryInterface } from '@components/shipping-address/interface/shipping-address.repository.interface';
import { ShippingAddress } from 'src/models/shipping-address/shipping-address.schema';
import { is } from 'bluebird';
import { ShippingMethod } from 'src/models/shipping-method/shipping-method.schema';
import { TiktokStatusEnum } from '@components/item/item.constant';
import { changeOrderStatusRequestDto } from './dto/request/change-order-status.request.dto';

@Injectable()
export class OrderService implements OrderServiceInterface {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,

    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,

    @Inject('CartRepositoryInterface')
    private readonly cartRepository: CartRepositoryInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('TiktokServiceInterface')
    private readonly tiktokService: TiktokServiceInterface,

    @Inject('ShippingMethodRepositoryInterface')
    private readonly shippingMethodRepository: ShippingMethodRepositoryInterface,

    @Inject('ShippingAddressRepositoryInterface')
    private readonly shippingAddressRepository: ShippingAddressRepositoryInterface,

    @InjectModel(ShippingAddress.name)
    private readonly shippingAddressSchema: Model<ShippingAddress>,

    @InjectModel(Order.name)
    private readonly OrderSchema: Model<Order>,

    @InjectModel(OrderDetail.name)
    private readonly OrderDetailSchema: Model<OrderDetail>,
  ) {}

  async create(request: CreateOrderRequestDto): Promise<any> {
    try {
      const { orderDetails } = request;
      console.log('🚀 ~ OrderService ~ create ~ orderDetails:', orderDetails);
      const totalAmount = orderDetails.reduce((total, item) => {
        const itemTotal =
          (item.quantity * item.price * (100 - item.discount)) / 100;
        return total + itemTotal;
      }, 0);
      console.log(
        '🚀 ~ OrderService ~ totalAmount ~ totalAmount:',
        totalAmount,
      );
      const code = this.generateOrderCode('OD');
      const orderDocument = this.orderRepository.createDocument({
        ...request,
        totalAmount,
        code,
      });
      const cartIds = compact(map(orderDetails, 'cartId'));
      const order = await this.orderRepository.create(orderDocument);
      const orderDetailDocuments = [];
      const itemIds = compact(map(orderDetails, 'itemId'));
      console.log('🚀 ~ OrderService ~ create ~ itemIds:', itemIds);
      const orderDetailMap = keyBy(orderDetails, 'itemId');
      orderDetails.forEach((orderDetail) => {
        const orderDetailDocument = this.orderDetailRepository.createDocument({
          ...orderDetail,
          orderId: order.id || order._id,
        });
        orderDetailDocuments.push(orderDetailDocument);
      });

      await this.orderDetailRepository.createMany(orderDetailDocuments);
      await this.cartRepository.deleteMany({
        _id: { $in: cartIds.map((id) => new Types.ObjectId(id)) },
      });
      const items = await this.itemService.getItemsByIds(
        itemIds.map((id) => new Types.ObjectId(id)),
      );
      const bulkOperations = items.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { stockQuantity: item.stockQuantity } },
        },
      }));

      await this.itemService.bulkWrite(bulkOperations);
      return new ResponseBuilder(order)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('error.SUCCESS')
        .build();
    } catch (error) {
      console.log(error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
  }

  async getList(request: GetListOrderRequestDto): Promise<any> {
    const { page } = request;
    const { data, count } = await this.orderRepository.getList(request);
    console.log('🚀 ~ OrderService ~ getList ~ data:', data);

    // implement logic here

    const response = plainToInstance(GetListOrderResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async getDetail(request: GetDetailOrderRequestDto): Promise<any> {
    const order = await this.orderRepository.getDetail(request);
    console.log('🚀 ~ OrderService ~ getDetail ~ order:', order);
    let rootTotalPrice = 0;
    let discountTotal = 0;
    order.orderDetails.forEach((orderDetail) => {
      rootTotalPrice += orderDetail.price * orderDetail.quantity;
      discountTotal +=
        ((orderDetail.price * orderDetail.discountPercent) / 100) *
        orderDetail.quantity;
    });
    const totalAmount = rootTotalPrice - discountTotal + order.shippingFee;
    // implement logic here

    if (isEmpty(order)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    const response = plainToInstance(GetDetailOrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      ...order,
      rootTotalPrice,
      discountTotal,
      totalAmount,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async update(request: UpdateOrderRequestDto): Promise<any> {
    const { id } = request;
    const order = await this.orderRepository.findOneById(id);

    if (isEmpty(order)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const newOrderSchema = this.orderRepository.updateDocument(order, request);

    const orderUpdate = await this.orderRepository.findByIdAndUpdate(
      id,
      newOrderSchema,
    );
    // implement logic here
    return new ResponseBuilder(orderUpdate)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async delete(request: DeleteOrderRequestDto): Promise<any> {
    const { id } = request;
    const order = await this.orderRepository.findOneById(id);

    if (isEmpty(order)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }

    await this.orderRepository.deleteById(id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
  async updatePaymentStatus(status: number, id: string): Promise<any> {
    return await this.orderRepository.findOneAndUpdate(
      { _id: id },
      { paymentStatus: status },
    );
  }

  async getOrderByUserId(request: any): Promise<any> {
    const { userId } = request;
    const orders = await this.orderRepository.getOrderByUserId(userId);

    return new ResponseBuilder(orders)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }

  async updateTiktokOrder(request: any): Promise<any> {
    const { order_id } = request.data;
    const exitsOrder = await this.orderRepository.findOneByCondition({
      tiktokOrderId: order_id,
    });

    if (!isEmpty(exitsOrder)) {
      const orderStatusKey = request.data
        .order_status as keyof typeof OrderStatus;
      const orderStatusValue = OrderStatus[orderStatusKey];
      if (orderStatusValue >= OrderStatus.AWAITING_COLLECTION) {
        const tiktokOrder = await this.tiktokService.getTiktokOrderDetail(
          order_id,
        );
        exitsOrder.trackingNumber = tiktokOrder?.tracking_number;
      }
      exitsOrder.tiktokOrderStatus = orderStatusValue;
      exitsOrder.status = orderStatusValue;
      await this.orderRepository.updateById(exitsOrder._id, exitsOrder);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('error.SUCCESS')
        .build();
    }
    //Todo: update tracking number and check paymentMethod
    const tiktokOrder = await this.tiktokService.getTiktokOrderDetail(order_id);
    if (isEmpty(tiktokOrder)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    const tiktokProductIds = map(tiktokOrder.order_line_list, 'product_id');
    const items = await this.itemService.getItemsByTiktokIds(tiktokProductIds);
    const totals = tiktokOrder.order_line_list.reduce((acc, item) => {
      const { product_id, sale_price } = item;

      if (!acc[product_id]) {
        acc[product_id] = {
          quantity: 0,
          total_price: 0,
          product_name: item.product_name,
        };
      }

      acc[product_id].quantity += 1;
      acc[product_id].total_price = sale_price;

      return acc;
    }, {});
    const result = Object.keys(totals).map((product_id) => ({
      product_id,
      product_name: totals[product_id].product_name,
      quantity: totals[product_id].quantity,
      total_price: totals[product_id].total_price,
      sellerDiscount: totals[product_id].seller_discount,
    }));
    const itemMap = keyBy(items, 'tiktokId');
    const shipingMethod =
      await this.shippingMethodRepository.findOneByCondition({
        code: 'GHN',
      });
    //Todo: Tao di chi giao hang
    const newShippingAddress = new this.shippingAddressSchema();
    newShippingAddress.userId = new Types.ObjectId('674095b5edf7e43c600d1101');
    newShippingAddress.status = 1;
    newShippingAddress.address = tiktokOrder.recipient_address?.full_address;
    newShippingAddress.name = tiktokOrder.recipient_address?.name;
    newShippingAddress.phone = tiktokOrder.recipient_address?.phone;
    newShippingAddress.isDefault = true;
    const shipingAddress = await this.shippingAddressRepository.create(
      newShippingAddress,
    );
    // Tạo đơn hàng
    const newOrder = new this.OrderSchema();
    newOrder.code = this.generateOrderCode('TK');
    newOrder.userId = tiktokOrder.buyer_uid;
    newOrder.status = tiktokOrder.order_status;
    newOrder.shipingMethodId = tiktokOrder.delivery_option_id;
    if (!tiktokOrder.is_cod) {
      newOrder.paymentMethod = PaymentMethodEnum.VNPAY;
      newOrder.paymentStatus = 1;
    } else {
      newOrder.paymentMethod = PaymentMethodEnum.COD;
      newOrder.paymentStatus = 1;
    }
    newOrder.shipingMethodId = shipingMethod._id;
    newOrder.shipingAddressId = shipingAddress._id;
    tiktokOrder.payment_info?.shipping_fee || 0;
    newOrder.orderAt = new Date(parseInt(tiktokOrder.create_time));
    newOrder.completeAt = tiktokOrder.paid_time
      ? new Date(parseInt(tiktokOrder.paid_time))
      : null;
    newOrder.paymentStatus = 0;
    newOrder.tiktokOrderId = tiktokOrder.order_id;
    newOrder.shippingFee = tiktokOrder.payment_info?.shipping_fee || 0;
    newOrder.tiktokOrderStatus = tiktokOrder.order_status;
    newOrder.shippingProvider = tiktokOrder.shipping_provider;
    newOrder.trackingNumber = tiktokOrder.tracking_number;
    newOrder.note = tiktokOrder.buyer_message;
    newOrder.totalAmount = tiktokOrder.payment_info?.total_amount;
    newOrder.productCount = result.length || 0;
    const order = await this.orderRepository.create(newOrder);

    // Tạo chi tiết đơn hàng
    const newOrderDetails = result.map((item) => {
      const orderDetail = new this.OrderDetailSchema();
      orderDetail.orderId = order._id;
      orderDetail.itemId = itemMap[item.product_id]?._id;
      orderDetail.quantity = item.quantity;
      orderDetail.price = item.total_price;
      orderDetail.discountPercent = item.sellerDiscount || 0;
      orderDetail.tiktokOrderId = order._id;
      orderDetail.tiktokOrderStatus = tiktokOrder.order_status;

      return orderDetail;
    });

    const orderDetails = await this.orderDetailRepository.createMany(
      newOrderDetails,
    );

    return new ResponseBuilder({
      order,
      orderDetails,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
  private generateOrderCode(prefix: string): string {
    const timestamp = Date.now(); // Lấy timestamp hiện tại (milliseconds từ 1970-01-01)
    return `${prefix}-${timestamp}`;
  }
  async changeOrderStatus(request: changeOrderStatusRequestDto): Promise<any> {
    const { id, status } = request;
    const order = await this.orderRepository.findOneById(id);
    if (isEmpty(order)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('error.SUCCESS')
        .build();
    }
    order.status = status;
    if (status >= OrderStatus.AWAITING_COLLECTION) {
      order.trackingNumber =
        order.trackingNumber ?? this.generateTrackingNumber();
    }
    await this.orderRepository.updateById(id, order);
    return new ResponseBuilder(order)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('error.SUCCESS')
      .build();
  }
  private generateTrackingNumber(prefix = 'OR', length = 10) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối của năm
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng 2 chữ số
    const day = date.getDate().toString().padStart(2, '0'); // Ngày 2 chữ số

    const randomPart = Array.from({ length }, () =>
      Math.floor(Math.random() * 10),
    ).join('');

    return `${prefix}${year}${month}${day}${randomPart}`;
  }
  async getRecommendedItems(
    productId: Types.ObjectId,
  ): Promise<Types.ObjectId[]> {
    const coOccurrenceMatrix =
      await this.orderRepository.getProductCoOccurrence();

    console.log('🚀 ~ OrderService ~ coOccurrenceMatrix:', coOccurrenceMatrix);
    // Lọc danh sách sản phẩm liên quan từ productId
    const relatedProducts = coOccurrenceMatrix
      .filter((entry) => entry._id.productA.equals(productId))
      .sort((a, b) => b.count - a.count); // Sắp xếp theo mức độ liên quan

    return relatedProducts.map((entry) => entry._id.productB); // Trả về danh sách sản phẩm gợi ý
  }

  async recommendItems(request: any): Promise<any> {
    console.log('🚀 ~ OrderService ~ recommendItems ~ request:', request);
    const { id } = request;
    return await this.getRecommendedItems(id);
  }
}
