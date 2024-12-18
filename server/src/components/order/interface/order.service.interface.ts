import { GetListOrderRequestDto } from '../dto/request/get-list-order.request.dto';
import { GetDetailOrderRequestDto } from '../dto/request/get-detail-order.request.dto';
import { CreateOrderRequestDto } from '../dto/request/create-order.request.dto';
import { UpdateOrderRequestDto } from '../dto/request/update-order.request.dto';
import { DeleteOrderRequestDto } from '../dto/request/delete-order.request.dto';
import { changeOrderStatusRequestDto } from '../dto/request/change-order-status.request.dto';

export interface OrderServiceInterface {
  getList(request: GetListOrderRequestDto): Promise<any>;
  getDetail(request: GetDetailOrderRequestDto): Promise<any>;
  create(request: CreateOrderRequestDto): Promise<any>;
  update(request: UpdateOrderRequestDto): Promise<any>;
  delete(request: DeleteOrderRequestDto): Promise<any>;
  updatePaymentStatus(status: number, id: string): Promise<any>;
  getOrderByUserId(request: any): Promise<any>;
  updateTiktokOrder(request: any): Promise<any>;
  changeOrderStatus(request: changeOrderStatusRequestDto): Promise<any>;
  recommendItems(request: any): Promise<any>;
}
