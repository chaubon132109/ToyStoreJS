// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      return false;
    }
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const login = (data) => {
    const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7 ngày
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("tokenExpiry", expiryTime);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
      logout();
    } else if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
