import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Input } from "@components/ui/input";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Eye,
  Download,
  Search,
} from "lucide-react";
import api from "api";
import { formatCurrency } from "helper/currency";
import Topbar from "../Tobbar";

export default function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const paymentStats = [
    {
      id: 1,
      name: "Total Revenue",
      amount: "$12,345",
      change: "+15%",
      icon: <DollarSign className="h-8 w-8" />,
    },
    {
      id: 2,
      name: "Transactions",
      amount: "1,234",
      change: "+8%",
      icon: <CreditCard className="h-8 w-8" />,
    },
    {
      id: 3,
      name: "Average Order",
      amount: "$98.76",
      change: "+5%",
      icon: <TrendingUp className="h-8 w-8" />,
    },
    {
      id: 4,
      name: "Refunds",
      amount: "$543.21",
      change: "-2%",
      icon: <AlertCircle className="h-8 w-8" />,
    },
  ];

  const transactions = [
    {
      id: "T001",
      customer: "John Doe",
      amount: "$129.99",
      date: "2023-05-15",
      status: "Completed",
      method: "Credit Card",
    },
    {
      id: "T002",
      customer: "Jane Smith",
      amount: "$79.50",
      date: "2023-05-14",
      status: "Pending",
      method: "PayPal",
    },
    {
      id: "T003",
      customer: "Bob Johnson",
      amount: "$199.99",
      date: "2023-05-13",
      status: "Completed",
      method: "Debit Card",
    },
    {
      id: "T004",
      customer: "Alice Brown",
      amount: "$54.25",
      date: "2023-05-12",
      status: "Refunded",
      method: "Credit Card",
    },
    {
      id: "T005",
      customer: "Charlie Wilson",
      amount: "$149.99",
      date: "2023-05-11",
      status: "Completed",
      method: "Bank Transfer",
    },
  ];

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [payment, setPayment] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await api.get("/payments");
      const data = response.data.data.data;
      setPayment(data);
      setCount(response.data.data.count[0].count);
      console.log(count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
      <Topbar name="Quản lý thanh toán" />
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-white p-4">
          {paymentStats.map((stat) => (
            <Card key={stat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.amount}</div>
                <p
                  className={`text-xs ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center bg-white p-4">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã tham chiếu</TableHead>
                <TableHead>Mã ngân hàng</TableHead>
                <TableHead>Transaction No</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payment?.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium">
                    {transaction.txnRef}
                  </TableCell>
                  <TableCell>{transaction.bankCode}</TableCell>
                  <TableCell>{transaction.bankTranNo}</TableCell>
                  <TableCell>{transaction.cardType}</TableCell>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(transaction.amount / 100)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
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
  );
}
