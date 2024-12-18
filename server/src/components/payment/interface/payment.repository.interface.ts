
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListPaymentRequestDto } from '../dto/request/get-list-payment.request.dto';
import { GetDetailPaymentRequestDto } from '../dto/request/get-detail-payment.request.dto';
import {  Payment } from 'src/models/payment/payment.schema';

export interface PaymentRepositoryInterface
 extends BaseInterfaceRepository<Payment>  {
  createDocument(request: any): Payment;
  updateDocument(payment: Payment, request: any): Payment;
  getList(request: GetListPaymentRequestDto): Promise<any>;
  getDetail(request: GetDetailPaymentRequestDto): Promise<any>;
}
