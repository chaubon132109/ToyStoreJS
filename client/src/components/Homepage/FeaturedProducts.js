import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import api from "api";
import { useAuth } from "context/AuthContext";
import { formatCurrency } from "helper/currency";
import { toastConfig } from "helper/toast.config";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    name: "Robot Siêu Vui Nhộn Biết Nhảy Múa và Kể Chuyện",
    image: "/placeholder.svg?height=200&width=200",
    price: 920000,
    salePrice: 690000,
    discountPercentage: 25,
  },
  {
    id: 2,
    name: "Bộ Xếp Hình Nhiều Màu 1000 Chi Tiết Phát Triển Tư Duy",
    image: "/placeholder.svg?height=200&width=200",
    price: 575000,
    salePrice: 460000,
    discountPercentage: 20,
  },
  {
    id: 3,
    name: "Gấu Bông Đáng Yêu Siêu Mềm Mịn Kích Thước Lớn",
    image: "/placeholder.svg?height=200&width=200",
    price: 460000,
    salePrice: 345000,
    discountPercentage: 25,
  },
];

export default function FeaturedProducts() {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await api.get("/report/top-3-items");
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleAddToCart = (productId) => {
    if (!isLoggedIn) {
      toast.error(`Vui lòng đăng nhập`, {
        style: toastConfig.errorStyle,
      });
      handleLoginRedirect();
      return;
    }

    const body = {
      itemId: productId,
      quantity: 1,
    };

    api
      .post("/carts/add-to-cart", body)
      .then(() => {
        toast.success(`Thêm sản phẩm vào giỏ hàng thành công`, {
          style: toastConfig.successStyle,
        });
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        toast.error(`Lỗi khi thêm giỏ hàng`, {
          style: toastConfig.errorStyle,
        });
      });
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: window.location.pathname } });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 opacity-50"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="container mx-auto relative">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-800 relative">
            Sản phẩm nổi bật
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl text-yellow-400 opacity-50 -mt-[46px]">
              🌟
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card
                key={product.itemId}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-4">
                  <div className="relative h-[350px] w-[350px] mb-4 rounded-lg overflow-hidden">
                    <img
                      src={product.imageDetails[0]?.url}
                      alt={product.itemDetails.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-800">
                      Nổi bật
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      -{product.discountPercent}%
                    </Badge>
                  </div>
                  <a
                    className="text-lg font-semibold mb-2 text-purple-700 line-clamp-2 h-14"
                    href={`/products/${product.itemId}`}
                  >
                    {product.itemDetails.name}
                  </a>
                  <div className="flex flex-col mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(
                          product.itemDetails.price *
                            (1 - product.discountPercent / 100)
                        )}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-800"
                      >
                        Tiết kiệm{" "}
                        {formatCurrency(
                          product.itemDetails.price *
                            (product.discountPercent / 100)
                        )}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.itemDetails.price)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="bg-purple-50">
                  <Button
                    onClick={() => handleAddToCart(product.itemId)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white transition-colors duration-300"
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
