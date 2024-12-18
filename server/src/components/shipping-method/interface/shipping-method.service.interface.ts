
import { GetListShippingMethodRequestDto } from '../dto/request/get-list-shipping-method.request.dto';
import { GetDetailShippingMethodRequestDto } from '../dto/request/get-detail-shipping-method.request.dto';
import { CreateShippingMethodRequestDto } from '../dto/request/create-shipping-method.request.dto';
import { UpdateShippingMethodRequestDto } from '../dto/request/update-shipping-method.request.dto';
import { DeleteShippingMethodRequestDto } from '../dto/request/delete-shipping-method.request.dto';

export interface ShippingMethodServiceInterface {
  getList(request: GetListShippingMethodRequestDto): Promise<any>;
  getDetail(request: GetDetailShippingMethodRequestDto): Promise<any>;
  create(request: CreateShippingMethodRequestDto): Promise<any>;
  update(request: UpdateShippingMethodRequestDto): Promise<any>;
  delete(request: DeleteShippingMethodRequestDto): Promise<any>;
}
