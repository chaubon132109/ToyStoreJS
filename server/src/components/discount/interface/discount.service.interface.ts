
import { GetListDiscountRequestDto } from '../dto/request/get-list-discount.request.dto';
import { GetDetailDiscountRequestDto } from '../dto/request/get-detail-discount.request.dto';
import { CreateDiscountRequestDto } from '../dto/request/create-discount.request.dto';
import { UpdateDiscountRequestDto } from '../dto/request/update-discount.request.dto';
import { DeleteDiscountRequestDto } from '../dto/request/delete-discount.request.dto';

export interface DiscountServiceInterface {
  getList(request: GetListDiscountRequestDto): Promise<any>;
  getDetail(request: GetDetailDiscountRequestDto): Promise<any>;
  create(request: CreateDiscountRequestDto): Promise<any>;
  update(request: UpdateDiscountRequestDto): Promise<any>;
  delete(request: DeleteDiscountRequestDto): Promise<any>;
}
