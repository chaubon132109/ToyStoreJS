import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash, ArrowUpDown, Loader2 } from "lucide-react";
import { Input } from "../../ui/input";
import Topbar from "../Tobbar";
import api from "api";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "helper/currency";

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [nameFilter, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/items", {
        params: {
          keyword: nameFilter,
          filter: [
            {
              column: "price",
              text: `${minPrice},${maxPrice}`,
            },
          ],
        },
      });
      setProducts(response.data.data.items);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleViewProduct = (id) => {
    navigate(`/admin/products/detail/${id}`);
  };

  const redirectToCreateProduct = () => {
    navigate("/admin/products/create");
  };

  const handleEditProduct = (id) => {
    navigate(`/admin/products/update/${id}`);
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Topbar name="Quản lý sản phẩm" />
      <div className="w-full py-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={redirectToCreateProduct}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-md text-sm font-medium"
                >
                  Thêm sản phẩm
                </button>
                <select className="border rounded-md px-4 py-2.5 bg-white text-sm">
                  <option>Năm nay</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm theo tên hoặc mã sản phẩm
                </label>
                <Input
                  type="text"
                  placeholder="Tên hoặc mã sản phẩm"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="w-full py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá nhỏ nhất (VND)
                </label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá lớn nhất (VND)
                </label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full py-2.5"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-8 py-4 px-6">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left py-4 px-6">
                      <button className="flex items-center space-x-1 hover:text-blue-500">
                        <span>Tên sản phẩm</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6">Mã sản phẩm</th>
                    <th className="text-left py-4 px-6">
                      <button className="flex items-center space-x-1 hover:text-blue-500">
                        <span>Giá</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="text-left py-4 px-6">Tồn kho</th>
                    <th className="text-left py-4 px-6">Danh mục</th>
                    <th className="text-left py-4 px-6">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {product.code}
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-blue-600 font-medium">
                            {product.stockQuantity}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {product.stock?.sold} Sold
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {product.category?.name}
                      </td>
                      {/* <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-gray-900">
                              {product.rating}
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {product.reviews} Review
                          </span>
                        </div>
                      </td> */}
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleViewProduct(product.id)}
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                            <Trash className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Showing {products.length} entries
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
                  Previous
                </button>
                <button className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm">
                  1
                </button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
                  2
                </button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
                  3
                </button>
                <button className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListAdmin;
