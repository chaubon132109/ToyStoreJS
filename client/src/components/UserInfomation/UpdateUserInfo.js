// UpdateUserInfo.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SidebarUI } from "./Sidebar";
import api from "../../api";

const Container = styled.div`
  display: flex;
`;

const FormContainer = styled.div`
  width: 45%;
  margin: 20px auto;
`;

const FormGroup = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: inline-block;
  font-weight: 600;
  width: 25%;
`;

const Input = styled.input`
  padding: 15px;
  width: 60%;
`;

const Select = styled.select`
  width: 30%;
`;

const UpdateButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  width: 60%;
  background-color: red;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const UpdateUserInfo = () => {
  const [user, SetUser] = useState({});
  useEffect(() => {
    fetchDataUser();
  }, []);
  const fetchDataUser = async () => {
    try {
      const response = await api.get("/users/get-my-info");
      SetUser(response.data);
    } catch (error) {}
  };
  return (
    <Container>
      <SidebarUI />
      <FormContainer>
        <h1 style={{ textAlign: "center", width: "100%" }}>
          Sửa Thông Tin Cá Nhân
        </h1>
        <form style={{ marginTop: "20px" }}>
          <FormGroup>
            <Label>Họ tên thành viên</Label>
            <Input
              type="text"
              name="name"
              defaultValue={user.name}
              placeholder="Nhập họ tên"
            />
          </FormGroup>
          <FormGroup>
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              name="dob"
              defaultValue={user.dob}
              placeholder="Nhập ngày sinh"
            />
          </FormGroup>
          <FormGroup>
            <Label>Số điện thoại</Label>
            <Input
              type="text"
              name="phonenumber"
              defaultValue={user.phone}
              placeholder="Nhập số điện thoại"
            />
          </FormGroup>
          <FormGroup>
            <Label>Giới tính</Label>
            {console.log(user.gender)}
            <Select name="gender" value={user.gender}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <UpdateButton type="submit">Sửa</UpdateButton>
          </FormGroup>
        </form>
      </FormContainer>
    </Container>
  );
};

export default UpdateUserInfo;
