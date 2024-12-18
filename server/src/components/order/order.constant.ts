export enum OrderStatusEnum {
  ORDERED,
  DELIVERED,
  CANCELLED,
  COMPLETED,
}

export enum PaymentMethodEnum {
  VNPAY,
  COD,
}

export enum OrderStatus {
  UNPAID = 100,
  ON_HOLD = 105,
  AWAITING_SHIPMENT = 111,
  AWAITING_COLLECTION = 112,
  PARTIALLY_SHIPPING = 114,
  IN_TRANSIT = 121,
  DELIVERED = 122,
  COMPLETED = 130,
  CANCELLED = 140,
}

export const orderStatusNames = {
  '100': 'Chưa thanh toán', // UNPAID
  '105': 'Đang chờ xử lý', // ON_HOLD
  '111': 'Chờ giao hàng', // AWAITING_SHIPMENT
  '112': 'Chờ nhận hàng', // AWAITING_COLLECTION
  '114': 'Giao hàng một phần', // PARTIALLY_SHIPPING
  '121': 'Đang vận chuyển', // IN_TRANSIT
  '122': 'Đã giao hàng', // DELIVERED
  '130': 'Hoàn thành', // COMPLETED
  '140': 'Đã hủy', // CANCELLED
};
