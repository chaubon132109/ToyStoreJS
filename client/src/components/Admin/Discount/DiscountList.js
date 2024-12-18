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
import { Label } from "../../ui/label";
import { Checkbox } from "@components/ui/checkbox";
import {
  Percent,
  Tag,
  Calendar,
  Users,
  Edit,
  Trash2,
  PlusCircle,
  X,
  Lock,
  Unlock,
} from "lucide-react";
import Topbar from "../Tobbar";
import api from "api";

export default function DiscountCodesManagement() {
  const [showForm, setShowForm] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({
    code: "",
    percent: "",
    name: "",
    description: "",
    startApply: "",
    endApply: "",
  });
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log("🚀 ~ handleInputChange ~ id, value:", id, value);
    setFormData((prev) => ({
      ...prev,
      [id]: value, // Cập nhật giá trị của field tương ứng với id
    }));
  };

  const discountStats = [
    {
      id: 1,
      name: "Active Codes",
      count: 15,
      icon: <Tag className="h-8 w-8" />,
    },
    {
      id: 2,
      name: "Total Uses",
      count: 1234,
      icon: <Users className="h-8 w-8" />,
    },
    {
      id: 3,
      name: "Avg. Discount",
      count: "25%",
      icon: <Percent className="h-8 w-8" />,
    },
    {
      id: 4,
      name: "Expiring Soon",
      count: 3,
      icon: <Calendar className="h-8 w-8" />,
    },
  ];

  const fetchData = async () => {
    try {
      const response = await api.get("/discounts", {
        params: {
          keyword: keyword,
          // filters: filters,
          // sort: JSON.stringify([{ column: sortColumn, order: sortOrder }]),
          limit: limit,
          page: page,
        },
      });
      const data = response.data.data.items;
      setDiscounts(data);
      setCount(response.data.data.meta.total[0].count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [keyword]);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.post("/discounts", formData);
    console.log(response.data);
    setShowForm(false);
    fetchData();
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Topbar name="Quản lý chương trình khuyến mãi" />
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white">
          {discountStats.map((stat) => (
            <Card key={stat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center p-4 bg-white">
          <h2 className="text-lg font-semibold">Discount Codes</h2>
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Code
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6 bg-white">
            <CardHeader>
              <CardTitle>Create New Discount Code</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Mã khuyễn mãi</Label>
                    <Input
                      id="code"
                      placeholder="Nhập mã khuyễn mãi"
                      value={formData.code}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Phần trăm</Label>
                    <div className="flex">
                      <Input
                        id="percent"
                        placeholder="Nhập %"
                        value={formData.percent}
                        onChange={handleInputChange}
                      />
                      <select className="ml-2 border rounded-md px-2">
                        <option>%</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên khuyến mãi</Label>
                    <Input
                      id="name"
                      placeholder="Nhập tên khuyễn mãi"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Mô tả</Label>
                    <Input
                      id="description"
                      placeholder="Nhập mô tả"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startApply"
                      type="datetime-local"
                      value={formData.startApply}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endApply"
                      type="datetime-local"
                      value={formData.endApply}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variants="orange"
                    className="bg-orange-500 text-white"
                  >
                    Create Discount Code
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Mã giảm giá</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Percent</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.name}</TableCell>
                  <TableCell>{code.description || "No description"}</TableCell>
                  <TableCell>{code.percent}</TableCell>
                  <TableCell>
                    {code.startApply
                      ? new Date(code.startApply).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {code.startApply
                      ? new Date(code.endApply).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        new Date(code.endApply) < new Date()
                          ? "bg-gray-100 text-gray-800"
                          : code.status === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {new Date(code.endApply) < new Date()
                        ? "Hết hạn"
                        : code.status === 1
                        ? "Hoạt động"
                        : "Tạm dừng"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {new Date(code.endApply) > new Date() ? (
                        code.status === 1 ? (
                          <Button variant="ghost" size="icon">
                            <Lock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon">
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )
                      ) : null}
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
  );
}
