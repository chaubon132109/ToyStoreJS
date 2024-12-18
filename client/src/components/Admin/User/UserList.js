import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@components/ui/table";
import { Badge } from "../../../@components/ui/badge";
import { Checkbox } from "../../../@components/ui/checkbox";
import { Button } from "../../../@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../@components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../@components/ui/avatar";
import {
  Eye,
  Pencil,
  Trash2,
  Users,
  Package,
  Headphones,
  Receipt,
} from "lucide-react";
import Topbar from "../Tobbar";
import { useEffect, useState } from "react";
import api from "api";
import { Input } from "@components/ui/input";
import { formatCurrency } from "helper/currency";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const fetchData = async () => {
    try {
      const response = await api.get("/users", {
        params: {
          keyword: keyword,
          // filters: filters,
          // sort: JSON.stringify([{ column: sortColumn, order: sortOrder }]),
          limit: limit,
          page: page,
        },
      });
      const data = response.data.data.items;
      setUsers(data);
      setCount(response.data.data.meta.total[0].count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [keyword]);
  const handleChangeInput = (e) => {
    setSearch(e.target.value);
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
      <Topbar name="Quản lý người dùng" />
      <div className="w-full py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <Card>
            <CardContent className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tổng người dùng
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">+22.63k</h3>
                    <span className="text-sm text-green-600 bg-green-100 px-2 rounded-full">
                      +34.4%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tổng đơn hàng
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">+4.5k</h3>
                    <span className="text-sm text-red-600 bg-red-100 px-2 rounded-full">
                      +8.1%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Headphones className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bình luận
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">+1.03k</h3>
                    <span className="text-sm text-green-600 bg-green-100 px-2 rounded-full">
                      +12.5%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Thanh toán
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">
                      {formatCurrency(2000000)}
                    </h3>
                    <span className="text-sm text-green-600 bg-green-100 px-2 rounded-full">
                      +45.9%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 bg-white">
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Tên hoặc username"
                className="border rounded-md px-2 py-1"
                value={search}
                onChange={handleChangeInput}
              ></Input>
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

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Tên người dùng</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Số lượng đơn hàng</TableHead>
                  <TableHead>Tổng tiền hàng</TableHead>
                  <TableHead>Trang thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <span>{user.name}</span>
                    </TableCell>
                    <TableCell>{user.username || "-"}</TableCell>
                    <TableCell>{user.role === 0 ? "Admin" : "User"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{user.gender || "-"}</TableCell>
                    <TableCell>
                      {user.dob ? new Date(user.dob).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>{user.countOrder || 0}</TableCell>
                    <TableCell>
                      {user.totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || 0}{" "}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === 1 ? "success" : "warning"}
                      >
                        {user.status === 1 ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
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
