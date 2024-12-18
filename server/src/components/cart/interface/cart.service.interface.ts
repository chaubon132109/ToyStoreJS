import { GetListCartRequestDto } from '../dto/request/get-list-cart.request.dto';
import { GetDetailCartRequestDto } from '../dto/request/get-detail-cart.request.dto';
import { CreateCartRequestDto } from '../dto/request/create-cart.request.dto';
import { UpdateCartRequestDto } from '../dto/request/update-cart.request.dto';
import { DeleteCartRequestDto } from '../dto/request/delete-cart.request.dto';
import { UpdateCartQuantityRequestDto } from '../dto/request/update-cart-quantity.request.dto';
import { getListCartByIdsRequestDto } from '../dto/request/get-list-cart-by-ids.request.dto';

export interface CartServiceInterface {
  getList(request: GetListCartRequestDto): Promise<any>;
  getDetail(request: GetDetailCartRequestDto): Promise<any>;
  create(request: CreateCartRequestDto): Promise<any>;
  update(request: UpdateCartRequestDto): Promise<any>;
  delete(request: DeleteCartRequestDto): Promise<any>;
  addToCart(request: CreateCartRequestDto): Promise<any>;
  getListCartByUserId(request: GetListCartRequestDto): Promise<any>;
  updateCart(request: UpdateCartQuantityRequestDto): Promise<any>;
  getCartDetailByIds(request: getListCartByIdsRequestDto): Promise<any>;
}
