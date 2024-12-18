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
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Topbar from "../Tobbar";
import { useEffect, useState } from "react";
import api from "api";
import { Input } from "@components/ui/input";

export default function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const commentStats = [
    {
      id: 1,
      name: "Tổng số comment",
      count: count,
      icon: <MessageSquare className="h-8 w-8" />,
    },
    {
      id: 2,
      name: "Đang review",
      count: 56,
      icon: <AlertTriangle className="h-8 w-8" />,
    },
    {
      id: 3,
      name: "Chấp nhận",
      count: 1100,
      icon: <CheckCircle className="h-8 w-8" />,
    },
    {
      id: 4,
      name: "Spam",
      count: 78,
      icon: <ThumbsDown className="h-8 w-8" />,
    },
  ];
  const fetchData = async () => {
    try {
      const response = await api.get("/comments", {
        params: {
          keyword: keyword,
          // filters: filters,
          // sort: JSON.stringify([{ column: sortColumn, order: sortOrder }]),
          limit: limit,
          page: page,
        },
      });
      const data = response.data.data.items;
      setComments(data);
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

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Topbar name="Quản lý bình luận" />
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white">
          {commentStats.map((stat) => (
            <Card key={stat.id} className="bg-card">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 mb-4 text-primary">{stat.icon}</div>
                <h3 className="text-lg font-medium text-center">{stat.name}</h3>
                <p className="text-2xl font-bold">{stat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center p-4 bg-white">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nhập nội dung tim kiếm"
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
          <div className="flex gap-2">
            <Button variant="default">Approve Selected</Button>
            <Button variant="destructive">Mark as Spam</Button>
            <select className="border rounded-md px-2 py-1">
              <option>All Time</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Ngày dăng</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{comment.user.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell>{comment.item.code}</TableCell>
                  <TableCell>
                    {new Date(comment.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        comment.status === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {comment.status === 1 ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
