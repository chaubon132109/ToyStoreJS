
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListDiscountRequestDto } from '../dto/request/get-list-discount.request.dto';
import { GetDetailDiscountRequestDto } from '../dto/request/get-detail-discount.request.dto';
import {  Discount } from 'src/models/discount/discount.schema';

export interface DiscountRepositoryInterface
 extends BaseInterfaceRepository<Discount>  {
  createDocument(request: any): Discount;
  updateDocument(discount: Discount, request: any): Discount;
  getList(request: GetListDiscountRequestDto): Promise<any>;
  getDetail(request: GetDetailDiscountRequestDto): Promise<any>;
}
