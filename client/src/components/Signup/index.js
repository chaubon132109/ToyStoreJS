import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Error,
  Form,
  Input,
  InputField,
  Label,
  Select,
  SignupContainer,
  SubmitButton,
} from "../../style/Signup";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    numberphone: "",
    gender: "Nam",
    username: "",
    password: "",
    checkpassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Vui lòng nhập họ tên";
    if (!formData.dob) newErrors.dob = "Vui lòng nhập ngày sinh";
    if (!formData.numberphone)
      newErrors.numberphone = "Vui lòng nhập số điện thoại";
    else if (formData.numberphone.length !== 10 || isNaN(formData.numberphone))
      newErrors.numberphone = "Số điện thoại không hợp lệ";
    if (!formData.username) newErrors.username = "Vui lòng nhập tên đăng nhập";
    else if (formData.username.includes(" "))
      newErrors.username = "Tên đăng nhập không được chứa khoảng trống";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password))
        newErrors.password =
          "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt";
    }
    if (!formData.checkpassword)
      newErrors.checkpassword = "Vui lòng nhập lại mật khẩu";
    else if (formData.checkpassword !== formData.password)
      newErrors.checkpassword = "Mật khẩu nhập lại không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post("/auth/signup", formData); // Chỉnh đường dẫn API tùy vào backend
      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      toast.error("Lỗi khi tạo tài khoản, vui lòng thử lại.");
    }
  };

  return (
    <SignupContainer>
      <Toaster />
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        ĐĂNG KÝ TÀI KHOẢN CỦA BẠN
      </h2>
      <Form onSubmit={handleSubmit}>
        <InputField>
          <Label>Họ tên thành viên</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ tên"
          />
          {errors.name && <Error>{errors.name}</Error>}
        </InputField>
        <InputField>
          <Label>Ngày sinh</Label>
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="Nhập ngày sinh"
          />
          {errors.dob && <Error>{errors.dob}</Error>}
        </InputField>
        <InputField>
          <Label>Số điện thoại</Label>
          <Input
            type="text"
            name="numberphone"
            value={formData.numberphone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
          {errors.numberphone && <Error>{errors.numberphone}</Error>}
        </InputField>
        <InputField>
          <Label>Giới tính</Label>
          <Select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Select>
        </InputField>
        <InputField>
          <Label>Tên đăng nhập</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nhập tên đăng nhập"
          />
          {errors.username && <Error>{errors.username}</Error>}
        </InputField>
        <InputField>
          <Label>Mật khẩu</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />
          {errors.password && <Error>{errors.password}</Error>}
        </InputField>
        <InputField>
          <Label>Nhập lại mật khẩu</Label>
          <Input
            type="password"
            name="checkpassword"
            value={formData.checkpassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
          />
          {errors.checkpassword && <Error>{errors.checkpassword}</Error>}
        </InputField>
        <InputField>
          <Label></Label>
          <SubmitButton type="submit">ĐĂNG KÝ</SubmitButton>
        </InputField>
      </Form>
    </SignupContainer>
  );
};

export default Signup;
