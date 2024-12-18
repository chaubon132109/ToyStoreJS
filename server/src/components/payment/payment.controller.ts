import { isEmpty } from 'lodash';
import {
  Controller,
  Body,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PaymentServiceInterface } from './interface/payment.service.interface';
import { GetListPaymentRequestDto } from './dto/request/get-list-payment.request.dto';
import { GetDetailPaymentRequestDto } from './dto/request/get-detail-payment.request.dto';
import { CreatePaymentRequestDto } from './dto/request/create-payment.request.dto';
import { UpdatePaymentRequestDto } from './dto/request/update-payment.request.dto';
import { DeletePaymentRequestDto } from './dto/request/delete-payment.request.dto';
import { AuthGuard } from '@core/guards/authorization.guard';

@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject('PaymentServiceInterface')
    private readonly paymentService: PaymentServiceInterface,
  ) {}

  @Post('create_payment_url')
  createPaymentUrl(@Body() body: { amount: number; orderDescription: string }) {
    return this.paymentService.createPaymentUrl(
      body.amount,
      body.orderDescription,
    );
  }

  @Get('vnpay_return')
  vnpayReturn(@Query() query: any) {
    return this.paymentService.verifyReturnUrl(query);
  }

  @Get('')
  getList(@Query() query: GetListPaymentRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.paymentService.getList(query);
  }
}
