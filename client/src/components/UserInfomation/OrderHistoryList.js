import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { MessageCircle, Store, ChevronRight } from "lucide-react";
import { SidebarUI } from "./Sidebar";
import styled from "styled-components";
import api from "api";
import { useEffect, useState } from "react";
import { STATUS_TEXT } from "../../components/Admin/Order/constant";

const Container = styled.div`
  display: flex;
`;

const orderStatusNames = {
  105: "Đang chờ xử lý",
  111: "Chờ giao hàng",
  112: "Chờ nhận hàng",
  121: "Đang vận chuyển",
  122: "Đã giao hàng",
  130: "Hoàn thành",
  140: "Đã hủy",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState([]);

  const fetchOrderData = async () => {
    try {
      const response = await api.get("orders/my-order");
      const data = response.data.data.orders;
      const report = response.data.data.report;
      setOrders(data);
      setReport(report);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const getStatusCount = (status) => {
    const statusReport = report.find(
      (item) => item.status.toString() === status
    );
    return statusReport ? statusReport.count : 0;
  };

  return (
    <Container>
      <SidebarUI></SidebarUI>
      <div className="max-w-6xl mx-auto p-4 space-y-4 mt-4">
        {/* Order Status Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="all"
              className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent"
            >
              Tất cả
            </TabsTrigger>
            {Object.entries(orderStatusNames).map(([status, name]) => (
              <TabsTrigger
                key={status}
                value={status}
                className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent"
              >
                {name}
                {getStatusCount(status) > 0 && (
                  <Badge
                    variant="outline"
                    className="ml-1 bg-red-50 text-red-500"
                  >
                    {getStatusCount(status)}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Order List */}
          <TabsContent value="all" className="space-y-4 mt-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg bg-white">
                {/* Shop Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <p className="text-red-500 font-bold">
                    {new Date(order.orderAt).toLocaleDateString("vi-VN")}
                  </p>
                  <Badge variant="outline" className="text-orange-500">
                    {STATUS_TEXT[order.status]}
                  </Badge>
                </div>

                {/* Product Details */}
                {order.orderDetails.map((orderDetail) => (
                  <div key={orderDetail.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20">
                        <img
                          src={orderDetail.item?.images[0]?.url}
                          alt="Product"
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex justify-between my-auto">
                        <h3 className="font-medium">
                          {orderDetail.item?.name}
                        </h3>
                        <p className="text-sm"> x {orderDetail.quantity}</p>
                      </div>
                      <div className="text-right my-auto">
                        <p className="line-through text-gray-500">
                          {orderDetail.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </p>
                        <p className="text-red-500">
                          {(
                            (orderDetail.price *
                              (100 - orderDetail.discountPercent)) /
                            100
                          ).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Footer */}
                <div className="border-t p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">
                      Đơn hàng sẽ được chuẩn bị và chuyển đi trước{" "}
                      {new Date(
                        new Date(order.orderAt).setDate(
                          new Date(order.orderAt).getDate() + 4
                        )
                      ).toLocaleDateString("vi-VN")}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Thành tiền:</span>
                      <span className="text-xl font-medium text-red-500">
                        {order.totalAmount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline">Hủy Đơn Hàng</Button>
                    <Button
                      variant="default"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Liên Hệ Người Bán
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Add TabsContent for each status */}
          {Object.keys(orderStatusNames).map((status) => (
            <TabsContent key={status} value={status} className="space-y-4 mt-4">
              {orders
                .filter((order) => order.status.toString() === status)
                .map((order) => (
                  // Repeat the order item structure here for each status
                  <div key={order.id} className="border rounded-lg bg-white">
                    {/* Shop Header */}
                    <div className="flex items-center justify-between border-b p-4">
                      <p className="text-red-500 font-bold">
                        {new Date(order.orderAt).toLocaleDateString("vi-VN")}
                      </p>
                      <Badge variant="outline" className="text-orange-500">
                        {STATUS_TEXT[order.status]}
                      </Badge>
                    </div>

                    {/* Product Details */}
                    {order.orderDetails.map((orderDetail) => (
                      <div key={orderDetail.id} className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20">
                            <img
                              src={orderDetail.item?.images[0]?.url}
                              alt="Product"
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 flex justify-between my-auto">
                            <h3 className="font-medium">
                              {orderDetail.item?.name}
                            </h3>
                            <p className="text-sm"> x {orderDetail.quantity}</p>
                          </div>
                          <div className="text-right my-auto">
                            <p className="line-through text-gray-500">
                              {orderDetail.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </p>
                            <p className="text-red-500">
                              {(
                                (orderDetail.price *
                                  (100 - orderDetail.discountPercent)) /
                                100
                              ).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Order Footer */}
                    <div className="border-t p-4">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-sm">
                          Đơn hàng sẽ được chuẩn bị và chuyển đi trước{" "}
                          {new Date(
                            new Date(order.orderAt).setDate(
                              new Date(order.orderAt).getDate() + 4
                            )
                          ).toLocaleDateString("vi-VN")}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Thành tiền:</span>
                          <span className="text-xl font-medium text-red-500">
                            {order.totalAmount.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Hủy Đơn Hàng</Button>
                        <Button
                          variant="default"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Liên Hệ Người Bán
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Container>
  );
}
