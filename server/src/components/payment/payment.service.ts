import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { PaymentServiceInterface } from './interface/payment.service.interface';
import { OrderServiceInterface } from '@components/order/interface/order.service.interface';
import { PaymentStatusEnum } from './payment.constant';
import { PaymentRepositoryInterface } from './interface/payment.repository.interface';
import { GetListPaymentRequestDto } from './dto/request/get-list-payment.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';

@Injectable()
export class PaymentService implements PaymentServiceInterface {
  constructor(
    @Inject('OrderServiceInterface')
    private readonly orderService: OrderServiceInterface,

    @Inject('PaymentRepositoryInterface')
    private readonly paymentRepository: PaymentRepositoryInterface,
    private configService: ConfigService,
  ) {}

  private get vnpayConfig() {
    return this.configService.get('vnpay');
  }

  async createPaymentUrl(amount: number, orderDescription: string) {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('HHmmss');

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnpayConfig.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // Ensuring VNPay's amount format
      vnp_ReturnUrl: this.vnpayConfig.returnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    const sortedParams = this.sortObject(vnpParams);

    // Create the string to sign
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', this.vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams['vnp_SecureHash'] = signed;

    // Construct the payment URL
    const paymentUrl = new URL(this.vnpayConfig.url);
    Object.entries(sortedParams).forEach(([key, value]) =>
      paymentUrl.searchParams.append(key, value.toString()),
    );

    return { paymentUrl: paymentUrl.toString() };
  }

  async verifyReturnUrl(vnpParams: any) {
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Remove any non-VNPay-specific fields, like `user`
    delete vnpParams['user'];
    delete vnpParams['userId'];

    const sortedParams = this.sortObject(vnpParams);
    const signData = new URLSearchParams(sortedParams).toString();

    console.log('Sorted Params:', sortedParams); // Debug: Print sorted params
    console.log('Sign Data String:', signData); // Debug: Print the string to be signed

    const hmac = crypto.createHmac('sha512', this.vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const orderId = vnpParams['vnp_TxnRef'];
      const rspCode = vnpParams['vnp_ResponseCode'];
      const orderObjectId = vnpParams['vnp_OrderInfo'];
      //Todo: Tạo lưu payment và update tình trạng đơn hàng
      const updateOrderPaymentStatus =
        await this.orderService.updatePaymentStatus(
          PaymentStatusEnum.PAID,
          orderObjectId,
        );
      const paymentDocument = this.paymentRepository.createDocument({
        sortedParams,
      });
      await this.paymentRepository.create(paymentDocument);
      return {
        orderId,
        rspCode,
        message: 'success',
      };
    }
    return {
      message: 'Invalid signature',
    };
  }

  private sortObject(obj: any) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      if (obj[key]) {
        sorted[key] = obj[key];
      }
    });
    return sorted;
  }

  async getList(request: GetListPaymentRequestDto) {
    const payments = await this.paymentRepository.getList(request);
    return new ResponseBuilder(payments)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
