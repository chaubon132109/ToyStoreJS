
import { GetListOrderDetailRequestDto } from '../dto/request/get-list-order-detail.request.dto';
import { GetDetailOrderDetailRequestDto } from '../dto/request/get-detail-order-detail.request.dto';
import { CreateOrderDetailRequestDto } from '../dto/request/create-order-detail.request.dto';
import { UpdateOrderDetailRequestDto } from '../dto/request/update-order-detail.request.dto';
import { DeleteOrderDetailRequestDto } from '../dto/request/delete-order-detail.request.dto';

export interface OrderDetailServiceInterface {
  getList(request: GetListOrderDetailRequestDto): Promise<any>;
  getDetail(request: GetDetailOrderDetailRequestDto): Promise<any>;
  create(request: CreateOrderDetailRequestDto): Promise<any>;
  update(request: UpdateOrderDetailRequestDto): Promise<any>;
  delete(request: DeleteOrderDetailRequestDto): Promise<any>;
}
