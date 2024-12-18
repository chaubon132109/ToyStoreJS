import { GetListShippingAddressRequestDto } from '../dto/request/get-list-shipping-address.request.dto';
import { GetDetailShippingAddressRequestDto } from '../dto/request/get-detail-shipping-address.request.dto';
import { CreateShippingAddressRequestDto } from '../dto/request/create-shipping-address.request.dto';
import { UpdateShippingAddressRequestDto } from '../dto/request/update-shipping-address.request.dto';
import { DeleteShippingAddressRequestDto } from '../dto/request/delete-shipping-address.request.dto';
import { GetDefaultShippingAddressRequestDto } from '../dto/request/get-default-shiping-address.request.dto';

export interface ShippingAddressServiceInterface {
  getList(request: GetListShippingAddressRequestDto): Promise<any>;
  getDetail(request: GetDetailShippingAddressRequestDto): Promise<any>;
  create(request: CreateShippingAddressRequestDto): Promise<any>;
  update(request: UpdateShippingAddressRequestDto): Promise<any>;
  delete(request: DeleteShippingAddressRequestDto): Promise<any>;
  getDefaultShippingAddress(
    request: GetDefaultShippingAddressRequestDto,
  ): Promise<any>;
  getAddressByUserId(userId: string): Promise<any>;
}
