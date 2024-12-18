"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatCurrency } from "helper/currency";
import { Badge } from "@components/ui/badge";
import { useEffect, useState } from "react";
import api from "api";

// const products = [
//   {
//     name: "1Lego Christmas Wreath",
//     price: 1290000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "2Máy In Ảnh Mini",
//     price: 890000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "3Lego Christmas Wreath",
//     price: 1290000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "4Máy In Ảnh Mini",
//     price: 890000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "5Lego Christmas Wreath",
//     price: 1290000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "6Máy In Ảnh Mini",
//     price: 890000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "7Lego Christmas Wreath",
//     price: 1290000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "8Máy In Ảnh Mini",
//     price: 890000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "105Lego Christmas Wreath",
//     price: 1290000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
//   {
//     name: "116Máy In Ảnh Mini",
//     price: 890000,
//     discount: {
//       percent: 15,
//     },
//     image:
//       "https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513857/toystore/m%C3%A1y%20t%C3%ADnh%20hi%E1%BB%87n%20%C4%91%E1%BA%A1i%201.jpg",
//   },
// ];

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
  const [products, setProducts] = useState([]);
  const fetchData = async () => {
    try {
      const response = await api.get("/items", {
        params: {
          limit: 8,
        },
      });
      setProducts(response.data.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(products);
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
        <h2 className="text-2xl font-bold text-blue-900">Hàng mới</h2>
      </div>
      <div>
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.name} className="px-3">
              <div className="bg-white rounded-lg shadow-md p-4 relative">
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                  New
                </div>
                {product.discount && product.discount.percent > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    -{product.discount.percent}%
                  </div>
                )}
                <div className="relative h-48 mb-4">
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-sm mb-2 font-bold min-h-10">
                  {product.name}
                </h3>
                <div className="flex flex-col mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(
                        product.price * (1 - product.discount.percent / 100)
                      )}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-200 text-green-800"
                    >
                      Tiết kiệm{" "}
                      {formatCurrency(
                        product.price * (product.discount.percent / 100)
                      )}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">
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
