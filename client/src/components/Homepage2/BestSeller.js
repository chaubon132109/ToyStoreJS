"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatCurrency } from "helper/currency";
import { Badge } from "@components/ui/badge";
import { useEffect, useState } from "react";
import api from "api";
import toast from "react-hot-toast";
import { toastConfig } from "helper/toast.config";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
      aria-label="Next age group"
    >
      <ChevronRight className="w-6 h-6 text-gray-600" />
    </button>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
      aria-label="Previous age group"
    >
      <ChevronLeft className="w-6 h-6 text-gray-600" />
    </button>
  );
};

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await api.get("/report/top-3-items");
      setBestSellers(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleAddToCart = (productId1) => {
    if (!isLoggedIn) {
      toast.error(`Vui lòng đăng nhập`, {
        style: toastConfig.errorStyle,
      });
      navigate("/login");
      return;
    }

    if (!productId1) {
      toast.error(`Lỗi khi thêm vào giỏ hàng`, {
        style: toastConfig.errorStyle,
      });
      return;
    }

    const body = {
      itemId: productId1,
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
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const calculateDiscountedPrice = (price, discountPercent) => {
    return price - (price * discountPercent) / 100;
  };

  return (
    <section className="space-y-6">
      <div className="mx-auto">
        <h2 className="text-2xl font-bold text-blue-900">
          Top 10 Sản Phẩm Bán Chạy
        </h2>
      </div>
      <div>
        <Slider {...settings}>
          {bestSellers.map((product) => (
            <div key={product.itemDetails.name} className="px-3">
              <div className="bg-white rounded-lg shadow-md p-4 relative">
                {product.discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    -{product.discountPercent}%
                  </div>
                )}
                <div className="relative h-48 mb-4">
                  <img
                    src={product.imageDetails[0].url}
                    alt={product.itemDetails.name}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-sm font-bold min-h-10 mb-2">
                  {product.itemDetails.name}
                </h3>
                <div className="flex flex-col mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(product.salePrice)}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-200 text-green-800"
                    >
                      Tiết kiệm{" "}
                      {formatCurrency(
                        product.itemDetails.price - product.salePrice
                      )}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.itemDetails.price)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product.itemId)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button className="p-2 border border-gray-200 rounded hover:bg-gray-50">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
