import { AuthGuard } from '@core/guards/authorization.guard';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ReportServiceInterface } from './interface/report.service.interface';

@Controller('report')
export class ReportController {
  constructor(
    @Inject('ReportServiceInterface')
    private readonly reportServiceInterface: ReportServiceInterface,
  ) {}

  @Get('total')
  @UseGuards(AuthGuard)
  async getTotal() {
    return await this.reportServiceInterface.getTotal();
  }

  @Get('top-3-items')
  async getTop3Items() {
    return await this.reportServiceInterface.getTop3Items();
  }
}
