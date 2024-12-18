import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListShippingMethodRequestDto } from '../dto/request/get-list-shipping-method.request.dto';
import { GetDetailShippingMethodRequestDto } from '../dto/request/get-detail-shipping-method.request.dto';
import { ShippingMethod } from 'src/models/shipping-method/shipping-method.schema';

export interface ShippingMethodRepositoryInterface
  extends BaseInterfaceRepository<ShippingMethod> {
  createDocument(request: any): ShippingMethod;
  updateDocument(shippingMethod: ShippingMethod, request: any): ShippingMethod;
  getList(request: GetListShippingMethodRequestDto): Promise<any>;
  getDetail(request: GetDetailShippingMethodRequestDto): Promise<any>;
}
