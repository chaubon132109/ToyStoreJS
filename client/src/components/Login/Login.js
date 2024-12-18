// src/components/LoginPage.js
import React from "react";
import Login from "./index";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();
  const from = location.state?.from || "/";
  return (
    <div>
      <Login from={from} />
    </div>
  );
};

export default LoginPage;
