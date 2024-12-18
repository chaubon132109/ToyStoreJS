import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListShippingAddressRequestDto } from '../dto/request/get-list-shipping-address.request.dto';
import { GetDetailShippingAddressRequestDto } from '../dto/request/get-detail-shipping-address.request.dto';
import { ShippingAddress } from 'src/models/shipping-address/shipping-address.schema';

export interface ShippingAddressRepositoryInterface
  extends BaseInterfaceRepository<ShippingAddress> {
  createDocument(request: any): ShippingAddress;
  updateDocument(
    shippingAddress: ShippingAddress,
    request: any,
  ): ShippingAddress;
  getList(request: GetListShippingAddressRequestDto): Promise<any>;
  getDetail(request: GetDetailShippingAddressRequestDto): Promise<any>;
}
