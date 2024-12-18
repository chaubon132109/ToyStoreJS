// src/components/Header.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLock,
  faUser,
  faLocationPin,
  faMagnifyingGlass,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "../style/header.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const handleLoginClick = () => {
    navigate("/login", { state: { from: window.location.pathname } }); // Lưu trang hiện tại
  };
  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn form tự động reload trang
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
    } else {
      navigate("/products"); // Redirect tới trang sản phẩm nếu không nhập keyword
    }
  };
  const { isLoggedIn, logout } = useAuth();
  const handleLinkClick = (ageStart, ageEnd) => {
    const url = new URL("/products", window.location.origin); // Lấy URL hiện tại
    const params = new URLSearchParams(url.search); // Lấy query parameters hiện tại

    // Thêm hoặc cập nhật các giá trị mới
    params.set("ageStart", ageStart);
    if (ageEnd) {
      params.set("ageEnd", ageEnd);
    }

    // Cập nhật URL
    url.search = params.toString();
    window.location.href = url.toString();
  };
  return (
    <div className="header">
      <div className="header_top">
        <div className="header_top--hotline">
          <FontAwesomeIcon icon={faPhone} style={{ color: "#ffffff" }} />
          <div className="phone_number">HOTLINE: 19001208</div>
        </div>
        <div className="header_top--store">
          <FontAwesomeIcon icon={faLocationPin} style={{ color: "#ffffff" }} />
          <div className="store_location">
            Hệ thống có 30 cửa hàng trên cả nước
          </div>
        </div>
      </div>

      <div className="header_mid">
        <a href="/">
          <img
            className="header_mid_logo"
            src="https://res.cloudinary.com/dg5ivgmho/image/upload/v1730513862/toystore/logo.png"
            alt="Logo"
          />
        </a>
        <div className="header_mid--search-bar">
          <input
            className="search_input"
            type="text"
            placeholder="Tìm kiếm sản phẩm.."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={handleSearch} className="search_submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <div className="header_account">
          {isLoggedIn ? (
            <>
              <div className="login">
                <a href="/cart">
                  <FontAwesomeIcon icon={faShoppingCart} /> GIỎ HÀNG
                </a>
              </div>
              <div className="signup user">
                <a href="/my-info">
                  <FontAwesomeIcon icon={faUser} /> NGƯỜI DÙNG
                </a>
                <ul className="submenu">
                  <li>
                    <a href="/my-info">Xem TTCN</a>
                  </li>
                  <li>
                    <a href="/orderHistory">Xem đơn hàng</a>
                  </li>
                  <li>
                    <a href="" onClick={logout}>
                      Đăng xuất
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="login" onClick={handleLoginClick}>
                <FontAwesomeIcon icon={faLock} onClick={handleLoginClick} />{" "}
                LOGIN
              </div>
              <div className="signup">
                <a href="/signup">
                  <FontAwesomeIcon icon={faUser} /> SIGN UP
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="header_menu">
        <nav className="navbar">
          <ul>
            <li>
              <a href="/homepage">TRANG CHỦ</a>
            </li>
            <li>
              <a href="/products">SẢN PHẨM</a>
            </li>
            <li className="dropdown">
              <a href="/gender">GIỚI TÍNH</a>
              <div className="dropdown-content">
                <a href="/products?gender=Nam">Bé trai</a>
                <a href="/products?gender=Nữ">Bé gái</a>
                <a href="/products?gender=Unisex">Unisex</a>
              </div>
            </li>
            <li className="dropdown">
              <a href="/age">ĐỘ TUỔI</a>
              <div className="dropdown-content">
                <a
                  href="products"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(0, 1);
                  }}
                >
                  0-12 tháng
                </a>
                <a
                  href="products"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(1, 3);
                  }}
                >
                  1-3 tuổi
                </a>
                <a
                  href="products"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(3, 6);
                  }}
                >
                  3-6 tuổi
                </a>
                <a
                  href="products"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(6, 12);
                  }}
                >
                  6-12 tuổi
                </a>
                <a
                  href="products"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(12);
                  }}
                >
                  Trên 12 tuổi
                </a>
              </div>
            </li>
            <li>
              <a href="/products?isDiscount=true">KHUYẾN MÃI</a>
            </li>
            <li>
              <a href="/products?isStock=true">CÒN HÀNG</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
