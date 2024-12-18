import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import api from "api";
import toast, { Toaster } from "react-hot-toast";
import { toastConfig } from "helper/toast.config";
import { useEffect, useState } from "react";
import { formatCurrency } from "helper/currency";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const COLORS_ORDER = {
  100: "#FFBB28",
  105: "#00C49F",
  111: "#0088FE",
  112: "#FF8042",
  114: "#8884D8",
  121: "#FF6347",
  122: "#00C49F",
  130: "#32CD32",
  140: "#FF4500",
};
const ORDER_STATUS_MAP = {
  "Chưa thanh toán": 100,
  "Đang chờ xử lý": 105,
  "Chờ giao hàng": 111,
  "Chờ nhận hàng": 112,
  "Giao hàng một phần": 114,
  "Đang vận chuyển": 121,
  "Đã giao hàng": 122,
  "Hoàn thành": 130,
  "Đã hủy": 140,
};

export default function Dashboard() {
  const [reportData, setReportData] = useState([]);
  const fetchReportData = async () => {
    try {
      const response = await api.get("/report/total");
      setReportData(response.data);
    } catch (error) {
      toast.error(`Lỗi khi lấy dữ liệu`, {
        style: toastConfig.errorStyle,
      });
    }
  };
  useEffect(() => {
    fetchReportData();
  }, []);
  const data = reportData?.discountReport?.map((item) => ({
    name: `${item._id}%`,
    "Số lượng sản phẩm": item.totalQuantity,
    "Tổng doanh thu": item.totalPrice,
    "Số lượng đơn hàng": item.count,
  }));
  console.log("🚀 ~ data ~ data:", data);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">E-commerce Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu hôm nay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportData.totalAmount)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số đơn hàng
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.countOrder}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Số lượng tồn kho
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalStock}</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Số lượng khách hàng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.countCustomer}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng trong năm</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {console.log(reportData)}
              <BarChart
                data={reportData.totalAmountByMonth?.sort(
                  (a, b) => a.month - b.month
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(month) =>
                    [
                      "Tháng 1",
                      "Tháng 2",
                      "Tháng 3",
                      "Tháng 4",
                      "Tháng 5",
                      "Tháng 6",
                      "Tháng 7",
                      "Tháng 8",
                      "Tháng 9",
                      "Tháng 10",
                      "Tháng 11",
                      "Tháng 12",
                    ][month - 1]
                  }
                />
                <YAxis tickFormatter={(value) => `${value / 1000000} triệu`} />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)
                  }
                />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.topSellingItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="code" />
                <YAxis />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload && payload.length > 0) {
                      const item = payload[0].payload; // Lấy đối tượng item từ payload
                      return (
                        <div className="custom-tooltip bg-white p-2">
                          <p>
                            <strong>Tên:</strong> {item.name}
                          </p>{" "}
                          {/* Hiển thị tên sản phẩm */}
                          <p>
                            <strong>Số lượng bán:</strong> {item.sales}
                          </p>{" "}
                          {/* Hiển thị số lượng bán */}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Tình trạng hàng tồn kho</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {reportData.inventoryData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Tình trạng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.countOrdersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {reportData.countOrdersByStatus?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS_ORDER[ORDER_STATUS_MAP[entry.name]] || "#8884d8"
                      } // Chọn màu dựa trên tên trạng thái
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-1 mb-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Hiệu quả khuyến mãi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="Số lượng sản phẩm"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="Tổng doanh thu"
                    fill="#82ca9d"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="Số lượng đơn hàng"
                    fill="#ffc658"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster
        position={toastConfig.position}
        toastOptions={{
          duration: toastConfig.duration,
        }}
      />
    </div>
  );
}
