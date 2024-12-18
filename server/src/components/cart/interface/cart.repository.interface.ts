import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListCartRequestDto } from '../dto/request/get-list-cart.request.dto';
import { GetDetailCartRequestDto } from '../dto/request/get-detail-cart.request.dto';
import { Cart } from 'src/models/cart/cart.schema';

export interface CartRepositoryInterface extends BaseInterfaceRepository<Cart> {
  createDocument(request: any): Cart;
  updateDocument(cart: Cart, request: any): Cart;
  getList(request: GetListCartRequestDto): Promise<any>;
  getDetail(request: GetDetailCartRequestDto): Promise<any>;
  getListCartByUser(request: GetListCartRequestDto): Promise<any>;
  updateCartQuatity(cartId: string, quantity: number): Promise<any>;
  getListCartByIds(ids: string[]): Promise<any>;
}
