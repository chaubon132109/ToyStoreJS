import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../@components/ui/badge";
import {
  Clock,
  Package,
  CheckCircle,
  Truck,
  FileCheck,
  Edit2,
  RefreshCcw,
  CreditCard,
  User,
  Phone,
  MapPin,
  Image,
} from "lucide-react";
import Topbar from "../Tobbar";
import { useEffect, useState } from "react";
import api from "api";
import { useParams } from "react-router-dom";
import { formatCurrency } from "helper/currency";

export default function OrderDetails() {
  const [order, setOrder] = useState({});
  const [orderStatus, setOrderStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { id } = useParams();

  const statusMapping = {
    100: "Chưa thanh toán",
    105: "Đang chờ xử lý",
    111: "Chờ giao hàng",
    112: "Chờ nhận hàng",
    114: "Giao hàng một phần",
    121: "Đang vận chuyển",
    122: "Đã giao hàng",
    130: "Hoàn thành",
    140: "Đã hủy",
  };

  const createSteps = (currentStatus) => {
    console.log("🚀 ~ createSteps ~ currentStatus:", currentStatus);
    const statuses = [
      { code: 100, title: "Chưa thanh toán", icon: FileCheck },
      { code: 105, title: "Đang chờ xử lý", icon: CreditCard },
      { code: 111, title: "Chờ giao hàng", icon: Package },
      { code: 121, title: "Đang vận chuyển", icon: Truck },
      { code: 122, title: "Đã giao hàng", icon: CheckCircle },
      { code: 130, title: "Hoàn thành", icon: CheckCircle },
      { code: 140, title: "Đã hủy", icon: RefreshCcw },
    ];

    return statuses.map((status) => {
      let stepStatus = "pending";
      if (status.code < currentStatus) {
        stepStatus = "completed";
      } else if (status.code === currentStatus) {
        stepStatus = "current";
      }
      return {
        title: status.title,
        status: stepStatus,
        icon: status.icon,
      };
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`orders/${id}`);
      setOrder(response.data.data);
      setOrderStatus(createSteps(response.data.data.status));
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.put("orders/change-status", {
        id: id,
        status: newStatus,
      });
      await fetchData(); // Refresh the order data after successful status change
    } catch (error) {
      console.error("Error changing order status:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsUpdating(false);
    }
  };

  const getActionButtons = (status) => {
    const buttons = [];

    if (status !== 130) {
      // Not COMPLETED
      buttons.push(
        <Button
          key="cancel"
          variant="outline"
          className="bg-red-500 text-white hover:bg-red-600"
          onClick={() => handleStatusChange(140)}
          disabled={isUpdating}
        >
          Hủy đơn hàng
        </Button>
      );
    }

    switch (status) {
      case 100: // UNPAID
        buttons.push(
          <Button
            key="onhold"
            variant="outline"
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={() => handleStatusChange(105)}
            disabled={isUpdating}
          >
            Đặt chờ xử lý
          </Button>
        );
        break;
      case 105: // ON_HOLD
        buttons.push(
          <Button
            key="awaitshipment"
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => handleStatusChange(111)}
            disabled={isUpdating}
          >
            Chờ giao hàng
          </Button>
        );
        break;
      case 111: // AWAITING_SHIPMENT
        buttons.push(
          <Button
            key="intransit"
            variant="outline"
            className="bg-purple-500 text-white hover:bg-purple-600"
            onClick={() => handleStatusChange(121)}
            disabled={isUpdating}
          >
            Đang vận chuyển
          </Button>
        );
        break;
      case 121: // IN_TRANSIT
        buttons.push(
          <Button
            key="delivered"
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={() => handleStatusChange(122)}
            disabled={isUpdating}
          >
            Đã giao hàng
          </Button>
        );
        break;
      case 122: // DELIVERED
        buttons.push(
          <Button
            key="complete"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => handleStatusChange(130)}
            disabled={isUpdating}
          >
            Hoàn thành
          </Button>
        );
        break;
      default:
        break;
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Topbar name="Chi tiết đơn hàng" />
      <div className="p-6 bg-white">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Nội dung chính */}
          <div className="flex-1">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{order?.code}</h1>
                <div className="flex gap-2">
                  <Badge className="bg-green-500">
                    {order?.paymentStatus === 0
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-orange-500 border-orange-500"
                  >
                    {statusMapping[order?.status]}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {!order.tiktokOrderId && getActionButtons(order?.status)}
              </div>
            </div>

            {/* Theo dõi tiến trình */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Tiến trình</h2>
              <div className="flex justify-between mb-2">
                {orderStatus?.map((step, index) => (
                  <div
                    key={index}
                    className={`flex-1 ${
                      index < orderStatus.length - 1
                        ? "border-t-2 border-gray-200 relative"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-green-500 text-white"
                          : step.status === "current"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm mt-2">{step.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ngày ước tính */}
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Ngày giao hàng dự kiến: 25 Tháng 4, 2024</span>
            </div>

            {/* Sản phẩm */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Tên & kích thước</th>
                      <th className="text-left py-3">Số lượng</th>
                      <th className="text-right py-3">Giá</th>
                      <th className="text-right py-3">Giảm giá</th>
                      <th className="text-right py-3">Tổng cộng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.orderDetails?.map((detail, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={detail?.item?.images[0]?.url}
                              alt={detail?.item?.name}
                              width={48}
                              height={48}
                              className="rounded"
                            />
                            <div>
                              <p className="font-medium">
                                {detail?.item?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>{detail.quantity}</td>
                        <td className="text-right">
                          {formatCurrency(detail.price)}
                        </td>
                        <td className="text-right">
                          {detail.discountPercent} %
                        </td>
                        <td className="text-right">
                          {formatCurrency(
                            detail.price *
                              (1 - detail.discountPercent / 100) *
                              detail.quantity
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar phải */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Tóm tắt đơn hàng */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng phụ:</span>
                  <span>{formatCurrency(order?.rootTotalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="text-red-500">
                    -{formatCurrency(order?.discountTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{formatCurrency(order?.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-4 border-t">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(order?.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600 pr-1" />
                  <span>{order?.shipingAddress?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600 pr-1" />
                  <span>{order?.shipingAddress?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600 pr-1" />
                  <span>{order?.shipingAddress?.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
