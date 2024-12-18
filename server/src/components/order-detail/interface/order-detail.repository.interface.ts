import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListOrderDetailRequestDto } from '../dto/request/get-list-order-detail.request.dto';
import { GetDetailOrderDetailRequestDto } from '../dto/request/get-detail-order-detail.request.dto';
import { OrderDetail } from 'src/models/order-detail/order-detail.schema';

export interface OrderDetailRepositoryInterface
  extends BaseInterfaceRepository<OrderDetail> {
  createDocument(request: any): OrderDetail;
  updateDocument(orderDetail: OrderDetail, request: any): OrderDetail;
  getList(request: GetListOrderDetailRequestDto): Promise<any>;
  getDetail(request: GetDetailOrderDetailRequestDto): Promise<any>;
  getTopSellingProducts(): Promise<any[]>;
  getTop3Selling(): Promise<any[]>;
  getReportByDiscountPercent(): Promise<any>;
}
