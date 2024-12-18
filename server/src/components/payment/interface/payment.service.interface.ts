import { GetListPaymentRequestDto } from '../dto/request/get-list-payment.request.dto';

export interface PaymentServiceInterface {
  createPaymentUrl(amount: number, orderDescription: string);
  verifyReturnUrl(vnpParams: any);
  getList(request: GetListPaymentRequestDto);
}
