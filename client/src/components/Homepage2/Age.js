"use client";

import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ageGroups = [
  {
    range: "0-12 Tháng",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581129/0-12_nxcsn2.png",
    bgColor: "bg-pink-100",
  },
  {
    range: "1-3 Tuổi",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581129/1-3_wv6aq1.png",
    bgColor: "bg-sky-100",
  },
  {
    range: "3-6 Tuổi",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581129/3-6_y8i50z.png",
    bgColor: "bg-green-100",
  },
  {
    range: "6-9 Tuổi",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581131/6-9_rpfdvx.png",
    bgColor: "bg-yellow-100",
  },
  {
    range: "Trên 12 Tuổi",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581129/12-_tpvlpx.png",
    bgColor: "bg-purple-100",
  },
];

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

export default function AgeGroups() {
  const settings = {
    dots: false,
    infinite: false,
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

  return (
    <section className="container mx-auto py-8 px-0">
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
        Độ Tuổi
      </h2>
      <div className="relative">
        <Slider {...settings}>
          {ageGroups.map((group) => (
            <div key={group.range} className="px-3">
              <div
                className={`${group.bgColor} rounded-lg p-6 flex flex-col items-center`}
              >
                <div className="relative h-full	 w-40 mb-4">
                  <img
                    src={group.image}
                    alt={`Đồ chơi cho trẻ ${group.range}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <h3 className="text-lg font-medium mb-4">{group.range}</h3>
                <a
                  href={`/age-group/${encodeURIComponent(group.range)}`}
                  className="px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition-colors"
                >
                  Xem Thêm
                </a>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
