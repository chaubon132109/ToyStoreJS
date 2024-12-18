import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { GetListPaymentRequestDto } from '@components/payment/dto/request/get-list-payment.request.dto';
import { GetDetailPaymentRequestDto } from '@components/payment/dto/request/get-detail-payment.request.dto';
import { PaymentRepositoryInterface } from '@components/payment/interface/payment.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from 'src/models/payment/payment.schema';
import { isEmpty } from 'lodash';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Model, Types } from 'mongoose';

@Injectable()
export class PaymentRepository
  extends BaseAbstractRepository<Payment>
  implements PaymentRepositoryInterface
{
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentSchema: Model<Payment>,
  ) {
    super(paymentSchema);
  }

  createDocument(request: any): Payment {
    const { sortedParams } = request;
    const payment = new this.paymentSchema();

    if (request?.id) payment.id = request.id;

    payment.amount = sortedParams.vnp_Amount;
    payment.bankCode = sortedParams.vnp_BankCode;
    payment.bankTranNo = sortedParams.vnp_BankTranNo;
    payment.cardType = sortedParams.vnp_CardType;
    payment.orderId = new Types.ObjectId(sortedParams.vnp_OrderInfo);
    payment.txnRef = sortedParams.vnp_TxnRef;
    console.log('🚀 ~ createDocument ~ payment:', sortedParams.vnp_BankCode);

    // implement your logic here

    return payment;
  }

  updateDocument(payment: Payment, request: any): Payment {
    payment.amount = request.vnp_Amount;
    payment.bankCode = request.vnp_BankCode;
    payment.bankTranNo = request.vnp_BankTranNo;
    payment.cardType = request.vnp_CardType;
    payment.orderId = new Types.ObjectId(request.vnp_OrderInfo);
    payment.txnRef = request.vnp_TxnRef;
    // implement your logic here
    return payment;
  }

  async getList(request: GetListPaymentRequestDto): Promise<any> {
    const { keyword, skip, take, sort, filter } = request;
    let filterObj: any = request.filterObj || {};
    let sortObj = {};

    if (keyword?.length) {
      filterObj = {
        ...filterObj,
        $or: [
          { code: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
        ],
      };
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const sort = item.order == 'DESC' ? -1 : 1;
        switch (item.column) {
          case 'code':
            sortObj = { ...sortObj, code: sort };
            break;
          case 'name':
            sortObj = { ...sortObj, name: sort };
            break;
          case 'createdAt':
            sortObj = { ...sortObj, createdAt: sort };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1, _id: -1 };
    }

    const data = await this.paymentSchema
      .aggregate([])
      .match(filterObj)
      .sort(sortObj)
      .skip(skip)
      .limit(take)
      .exec();
    const count = await this.paymentSchema
      .aggregate([])
      .match(filterObj)
      .count('count')
      .exec();

    return { data, count };
  }
  async getDetail(request: GetDetailPaymentRequestDto): Promise<any> {
    const { id } = request;
    const payment = await this.paymentSchema.findById(id).exec();
    return payment;
  }
}
