import React, { useEffect, useState } from "react";
import ProductItem from "./item";
import api from "../../api";
import "../../style/listProduct.css";

const List = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState([]);
  const [isFilterReady, setIsFilterReady] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const ageStart = urlParams.get("ageStart");
  const ageEnd = urlParams.get("ageEnd");
  const keySearch = urlParams.get("keyword"); // Lấy keyword từ URL
  const gender = urlParams.get("gender");
  const isDiscount = urlParams.get("isDiscount");
  const isStock = urlParams.get("isStock");
  const productsPerPage = 12;

  // Gọi API khi filter, currentPage, hoặc keySearch thay đổi

  useEffect(() => {
    let initialFilter = [];
    if (ageStart) {
      initialFilter = [{ column: "age", text: `${ageStart}|${ageEnd || ""}` }];
    } else if (gender) {
      initialFilter = [{ column: "gender", text: gender }];
    } else if (isDiscount) {
      initialFilter = [{ column: "isDiscount", text: isDiscount }];
    } else if (isStock) {
      initialFilter = [{ column: "isStock", text: isStock }];
    }

    if (initialFilter.length > 0) {
      setFilter(initialFilter);
      setIsFilterReady(true);
    } else {
      setIsFilterReady(true);
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isFilterReady) {
      fetchProducts();
    }
  }, [currentPage, keySearch, isFilterReady, filter]); // Thêm keySearch vào dependencies

  const fetchProducts = async () => {
    try {
      const response = await api.get(
        `/items?page=${currentPage}&limit=${productsPerPage}`,
        {
          params: {
            filter: JSON.stringify(filter), // Gửi filter
            keyword: keySearch, // Thêm keyword vào params
          },
        }
      );
      setProducts(response.data.data.items);
      const page = response.data.data.meta.total[0]
        ? Math.ceil(response.data.data.meta.total[0]?.count / productsPerPage)
        : 1;
      setTotalPages(page);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data.items);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentPage(1);
    if (categoryId !== null) {
      setFilter([{ column: "categoryId", text: categoryId }]); // Reset filter
      setIsFilterReady(true);
    } else {
      setFilter([]); // Xóa filter
      setIsFilterReady(true);
    }
  };

  return (
    <div className="container1">
      <div className="sidebar">
        <ul className="category-menu">
          <li style={{ borderBottom: "none", padding: "0px" }}>
            <a
              style={{ marginBottom: "15px", fontSize: "20px", color: "red" }}
              href="#"
            >
              Danh Mục
            </a>
          </li>
          <li>
            <a href={`#`} onClick={() => handleCategoryChange(null)}>
              Tất cả
            </a>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <a href={`#`} onClick={() => handleCategoryChange(category.id)}>
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="product-details">
        <ul className="product_grid">
          {products.map((product) => (
            <ProductItem key={product.product_id} product={product} />
          ))}
        </ul>
        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <a
              key={i + 1}
              href="#"
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
