import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Checkbox } from "@components/ui/checkbox";
import {
  Eye,
  Headphones,
  Package,
  Pencil,
  ShoppingBag,
  GlassesIcon as Sunglasses,
  Trash2,
  Watch,
  Wallet,
  Lock,
  LockOpen,
} from "lucide-react";
import api from "api";
import Topbar from "../Tobbar";
import { Input } from "@components/ui/input";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { formatCurrency } from "helper/currency";

export default function CategoryList() {
  const [tableData, setTableData] = useState([]);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTableData = async () => {
    try {
      const response = await api.get("/categories", {
        params: {
          keyword: keyword,
          filters: filters,
          sort: JSON.stringify([{ column: sortColumn, order: sortOrder }]),
          limit: limit,
          page: page,
        },
      });
      const data = response.data.data.items;
      const totalPages = Math.ceil(
        response.data.data.meta.total[0].count / limit
      );
      setCount(response.data.data.meta.total[0].count);
      setTableData(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage <= 0 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleChangeInput = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    setKeyword(search);
  };

  const handlePageSizeChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handleCreateCategory = async (name, code) => {
    try {
      const response = await api.post("/categories", { name, code });
      console.log("Category created:", response.data);
      setIsModalOpen(false);
      await fetchTableData();
      setPage(1);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [filters, sortColumn, sortOrder, page, limit, keyword]);

  const categories = [
    {
      id: 1,
      name: "Fashion Categories",
      image: "/placeholder.svg?height=200&width=200",
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: 2,
      name: "Electronics Headphone",
      image: "/placeholder.svg?height=200&width=200",
      icon: <Headphones className="h-5 w-5" />,
    },
    {
      id: 3,
      name: "Foot Wares",
      image: "/placeholder.svg?height=200&width=200",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      id: 4,
      name: "Eye Ware & Sunglass",
      image: "/placeholder.svg?height=200&width=200",
      icon: <Sunglasses className="h-5 w-5" />,
    },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Topbar name="Quản lý danh mục" />
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {categories.map((category) => (
            <Card key={category.id} className="bg-card bg-white">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 mb-4">{category.icon}</div>
                <h3 className="text-sm font-medium text-center">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center bg-white p-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Tên hoặc mã danh mục"
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
          <div className="flex gap-2">
            <Button variant="orange" onClick={() => setIsModalOpen(true)}>
              Tạo mới
            </Button>
            <select className="border rounded-md px-2 py-1">
              <option>Tháng này</option>
              <option>Tháng trước</option>
              <option>Năm nay</option>
            </select>
          </div>
        </div>

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader style={{ backgroundColor: "beige" }}>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Khoảng giá</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Mã danh mục</TableHead>
                <TableHead>Tổng tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{row.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.minPrice && row.maxPrice
                      ? `${formatCurrency(row.minPrice)} - ${formatCurrency(
                          row.maxPrice
                        )}`
                      : formatCurrency(0)}
                  </TableCell>
                  <TableCell>{row.createdBy?.code || "Hệ thống"}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.totalStockQuantity}</TableCell>
                  <TableCell>
                    {" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        row.status === 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.status === 0 ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        {row.status === 0 ? (
                          <LockOpen className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
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
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}
