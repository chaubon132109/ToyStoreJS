import { Inject, Injectable, Logger } from '@nestjs/common';
import { ReportServiceInterface } from './interface/report.service.interface';
import { OrderRepositoryInterface } from '@components/order/interface/order.repository.interface';
import { ItemRepositoryInterface } from '@components/item/interface/item.repository.interface';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { OrderDetailRepositoryInterface } from '@components/order-detail/interface/order-detail.repository.interface';
import { orderStatusNames } from '@components/order/order.constant';

@Injectable()
export class ReportService implements ReportServiceInterface {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('OrderDetailRepositoryInterface')
    private readonly orderDetailRepository: OrderDetailRepositoryInterface,
    @Inject('ItemRepositoryInterface')
    private readonly itemRepository: ItemRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async getTotal() {
    const totalAmount = await this.orderRepository.getTotalAmountToday({});
    const countOrder = await this.orderRepository.countOrder();
    const totalStock = await this.itemRepository.totalStock();
    const countCustomer = await this.userRepository.countCustomer();
    const totalAmountByMonth =
      await this.orderRepository.sumTotalAmountByMonth();
    const countStockStatus = await this.itemRepository.countStockStatus();
    const fomartCountStockStatus = [
      { name: 'Còn hàng', value: countStockStatus.inStock },
      { name: 'Ít hàng', value: countStockStatus.lowStock },
      { name: 'Hết hàng', value: countStockStatus.outOfStock },
    ];
    const countOrdersByStatus =
      await this.orderRepository.countOrdersByStatus();
    const topSellingItems =
      await this.orderDetailRepository.getTopSellingProducts();
    const formatTopSellingItems = topSellingItems.map((item) => ({
      name: item.itemDetails.name,
      sales: item.totalQuantity,
      code: item.itemDetails.code,
    }));
    const formatCountOrdersByStatus = Object.keys(countOrdersByStatus).map(
      (status) => ({
        name: orderStatusNames[status], // Ánh xạ mã trạng thái sang tên
        value: countOrdersByStatus[status],
      }),
    );
    const discountReport =
      await this.orderDetailRepository.getReportByDiscountPercent();
    return {
      totalAmount,
      countOrder,
      totalStock,
      countCustomer,
      totalAmountByMonth,
      inventoryData: fomartCountStockStatus,
      countOrdersByStatus: formatCountOrdersByStatus,
      topSellingItems: formatTopSellingItems,
      discountReport,
    };
  }
  async getTop3Items() {
    return await this.orderDetailRepository.getTop3Selling();
  }
}
