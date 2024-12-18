// src/components/Login.js
import React, { useState } from "react";
import "../../style/login.css"; // Đảm bảo import file CSS nếu chưa có
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = ({ from }) => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Khai báo useNavigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3006/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data);
        navigate(from);
      } else {
        setError(
          "Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản và mật khẩu."
        );
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      console.error(error);
    }
  };

  return (
    <div className="content_login">
      <div>
        Đăng nhập để mua hàng và sử dụng những tiện ích mới nhất từ Mykingdom
      </div>
      <div className="content_login-signup">
        Bạn chưa có tài khoản?
        <a href="/signup" className="content_login-toSignUp">
          ĐĂNG KÝ TÀI KHOẢN
        </a>
      </div>
      <form onSubmit={handleLogin}>
        <div className="username-label">Tài khoản *</div>
        <input
          className="input-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tài khoản"
          required
        />
        <div className="password-label">Mật khẩu *</div>
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          required
        />
        <div className="forget_password">
          Quên mật khẩu? Khôi phục mật khẩu{" "}
          <a href="/forgetPassword">Tại đây</a>
        </div>
        <button className="button_login" type="submit">
          ĐĂNG NHẬP
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Login;
