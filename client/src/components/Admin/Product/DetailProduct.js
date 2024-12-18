// export default ProductDetails;
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/card"; // Import Card từ thư viện của bạn
import Topbar from "../Tobbar"; // Component Topbar
import api from "api"; // File Axios instance đã config
import { LoadingPage } from "../LoadingPage";
import { useParams } from "react-router-dom";
import { formatCurrency } from "helper/currency";

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null); // Dữ liệu chi tiết sản phẩm
  const { id } = useParams();

  // Hàm lấy chi tiết sản phẩm và các thông tin liên quan
  const fetchProduct = async () => {
    try {
      // Gọi API để lấy thông tin sản phẩm
      const productResponse = await api.get(`/items/${id}`);
      const productData = productResponse.data.data;
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Hiển thị "Loading..." khi dữ liệu đang được tải
  if (!product) return <LoadingPage />;

  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      {/* Thanh tiêu đề */}
      <Topbar name="Chi tiết sản phẩm" />

      <div className="grid grid-cols-12 gap-6">
        {/* Cột bên trái: Hiển thị ảnh sản phẩm */}
        <div className="col-span-4">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="bg-gray-50 rounded-lg mb-4">
                <img
                  src={product?.images[0].url || "/api/placeholder/400/320"}
                  alt="Product preview"
                  className="w-full object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-8">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-6">
                Thông tin sản phẩm
              </h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Tên sản phẩm:
                    </span>
                    <p className="text-gray-700">{product?.name}</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Danh mục:
                    </span>
                    <p className="text-gray-700">{product.category.name}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6 mt-4">
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Tuổi:
                    </span>
                    <p className="text-gray-700">{product?.age}</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Khối lượng:
                    </span>
                    <p className="text-gray-700">{product?.weight} Kg</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Giới tính
                    </span>
                    <p className="text-gray-700">{product?.gender}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 description-admin">
                <span className="text-sm font-medium text-gray-600">
                  Mô tả sản phẩm:
                </span>
                <div
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: product?.description }}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white mt-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-6">
                Thông tin bán hàng
              </h2>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Giá gốc:
                    </span>
                    <p className="text-gray-700">
                      {formatCurrency(product?.price)}
                    </p>
                  </div>
                </div>
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Giả bán:
                    </span>
                    <p className="text-gray-700">
                      {formatCurrency(
                        (product?.price *
                          (100 - (product?.discount?.percent || 0))) /
                          100
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Ưu đãi:
                    </span>
                    <p className="text-gray-700">
                      {product.discount?.name} - {product.discount?.percent}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6 mt-6">
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Số lượng tồn kho:
                    </span>
                    <p className="text-gray-700">{product?.stockQuantity}</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      SKU:
                    </span>
                    <p className="text-gray-700">{product?.sku}</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Code:
                    </span>
                    <p className="text-gray-700">{product?.code}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-6 mt-6">
                <div className="col-span-8">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      ----
                    </span>
                    <p className="text-gray-700">
                      {product?.isTiktokProduct
                        ? "Sản phẩm được đông bộ trên TiktokShop"
                        : "Sản phẩm thường"}
                    </p>
                  </div>
                </div>
                {product?.isTiktokProduct && (
                  <div className="col-span-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Tiktok Id:
                      </span>
                      <p className="text-gray-700">{product.tiktokId}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
