import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListOrderRequestDto } from '../dto/request/get-list-order.request.dto';
import { GetDetailOrderRequestDto } from '../dto/request/get-detail-order.request.dto';
import { Order } from 'src/models/order/order.schema';

export interface OrderRepositoryInterface
  extends BaseInterfaceRepository<Order> {
  createDocument(request: any): Order;
  updateDocument(order: Order, request: any): Order;
  getList(request: GetListOrderRequestDto): Promise<any>;
  getDetail(request: GetDetailOrderRequestDto): Promise<any>;
  getOrderByUserId(userId: string): Promise<any>;
  getTotalAmountToday(request: any): Promise<number>;
  countOrder(): Promise<number>;
  sumTotalAmountByMonth(): Promise<any>;
  countOrdersByStatus(): Promise<{ [key: string]: number }>;
  getProductCoOccurrence(): Promise<any>;
}
