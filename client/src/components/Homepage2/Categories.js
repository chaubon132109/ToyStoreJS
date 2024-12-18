const categories = [
  {
    title: "Đồ Chơi Mầm Non",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581130/mamnon_c57vgr.png",
    className: "col-span-1 md:col-span-1",
  },
  {
    title: "Đồ Thời Trang",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581131/thoitrang_bwmbka.png",
    className: "col-span-1 md:col-span-1",
  },
  {
    title: "Đồ Chơi Lắp Ghép",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581295/lapghep_zlrc3q.png",
    className: "col-span-2 md:col-span-2",
  },
  {
    title: "Robot",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581130/robot_eqyhib.png",
    className: "col-span-1 md:col-span-1",
  },
  {
    title: "Đồ Chơi Phương Tiện",
    image:
      "https://res.cloudinary.com/dg5ivgmho/image/upload/v1733581290/phuongtien_ma6jjm.png",
    className: "col-span-1 md:col-span-1",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
        Danh Mục Nổi Bật
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.title}
            className={`${category.className} bg-teal-50 overflow-hidden group rounded-3xl`}
          >
            <div className="relative">
              <img
                src={category.image}
                alt={category.title}
                width={"100%"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={category.title === "Đồ Chơi Lắp Ghép"}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-4 text-center bg-gray-400	">
              <h3 className="text-lg font-medium mb-3">{category.title}</h3>
              <a
                href={`/category/${encodeURIComponent(
                  category.title.toLowerCase()
                )}`}
                className="inline-block px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Xem Thêm
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
