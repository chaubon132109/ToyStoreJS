import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@components/ui/table";
import { Card, CardContent } from "../../ui/card";
import {
  Package,
  DollarSign,
  XCircle,
  Truck,
  FileSearch,
  Clock,
  CheckCircle,
  Loader,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../@components/ui/select";
import { useEffect, useState } from "react";
import api from "api";
import { STATUS_TEXT } from "./constant";
import Topbar from "../Tobbar";
import { Input } from "@components/ui/input";
import { useNavigate } from "react-router-dom";

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const stats = [
    {
      title: "Chưa thanh toán",
      value: "490",
      icon: DollarSign,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Đang chờ xử lý",
      value: "241",
      icon: Loader,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Chờ nhận hàng",
      value: "630",
      icon: Package,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Giao hàng một phần",
      value: "170",
      icon: Truck,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Đang vận chuyển",
      value: "210",
      icon: FileSearch,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Đã giao hàng",
      value: "608",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Hoàn thành",
      value: "200",
      icon: CheckCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Đã hủy",
      value: "656",
      icon: XCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];
  const fetchOrderData = async () => {
    try {
      const response = await api.get("orders", {
        params: {
          keyword: keyword,
          // filters: filters,
          // sort: JSON.stringify([{ column: sortColumn, order: sortOrder }]),
          limit: limit,
          page: page,
        },
      });
      const data = response.data.data.items;
      setCount(response.data.data.meta.total[0].count);
      setOrders(data);
      setTotalPages(Math.ceil(response.data.data.meta.total[0].count / limit));
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [keyword, page]);
  const handleChangeInput = (e) => {
    setSearch(e.target.value.trim());
  };
  const handleSearch = () => {
    setKeyword(search);
  };
  const handlePageChange = (newPage) => {
    if (newPage <= 0 || newPage > totalPages) return;
    setPage(newPage);
  };
  const handlePageSizeChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };
  return (
    <div className="max-w-screen-2xl mx-auto">
      <Topbar name="Quản lý đơn hàng" />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-6 bg-white">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Order ID"
                className="border rounded-md px-2 py-1"
                value={search}
                onChange={handleChangeInput}
              />
              <Button
                className="bg-blue-500 text-white"
                variant="orange"
                onClick={handleSearch}
              >
                Lọc
              </Button>
            </div>
            <Select defaultValue="this-month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Thời gian tạo</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tracking No</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Phương thức TT</TableHead>
                  <TableHead>Tình trạng TT</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.code || "#"}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {order.user.length > 0 && order.user[0].name
                        ? order.user[0].name
                        : "Tiktok"}
                    </TableCell>
                    <TableCell>{order.trackingNumber || "-"}</TableCell>
                    <TableCell>{order.productCount || "-"}</TableCell>
                    <TableCell>{order.totalAmount || "-"}</TableCell>
                    <TableCell>
                      {order.paymentMethod === 0 ? "Online" : "COD"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.paymentStatus === 1
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {order.paymentStatus === 0
                          ? "Chưa thanh toán"
                          : "Thanh toán"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          (order.tiktokOrderId
                            ? order.tiktokOrderStatus
                            : order.status) >= 121 &&
                          (order.tiktokOrderId
                            ? order.tiktokOrderStatus
                            : order.status) <= 130
                            ? "bg-green-100 text-green-600"
                            : (order.tiktokOrderId
                                ? order.tiktokOrderStatus
                                : order.status) >= 105 &&
                              (order.tiktokOrderId
                                ? order.tiktokOrderStatus
                                : order.status) <= 114
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {STATUS_TEXT[
                          order.tiktokOrderId
                            ? order.tiktokOrderStatus
                            : order.status
                        ] || "Chưa xác nhận"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            navigate(`/admin/orders/${order.id}`);
                          }}
                        >
                          <FileSearch className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Package className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center bg-white">
            <div className="flex gap-2">
              <div className="pl-4">Giới hạn trang</div>
              <select
                onChange={handlePageSizeChange}
                className="border rounded-md px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="p-4 pr-4 leading-9">
                {`${(page - 1) * limit + 1} - ${
                  page * limit > count ? count : page * limit
                }`}{" "}
                trên tổng số {count}
              </div>
              <div className="flex items-center justify-end space-x-2 p-4 bg-white">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                >
                  Trước
                </Button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant="outline"
                    size="sm"
                    className={i + 1 === page ? "bg-orange-500 text-white" : ""}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
