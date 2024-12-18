// UserInfo.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SidebarUI } from "./Sidebar";
import api from "../../api";

const Container = styled.div`
  display: flex;
`;

const PersonalInfo = styled.div`
  margin-top: 50px;
  margin-left: 50px;
  padding-left: 20px;
  width: 50%;
`;

const InfoList = styled.ul`
  margin-top: 30px;
  list-style-type: none;
  padding: 0;
`;

const UpdateButton = styled.button`
  padding: 20px 40px;
  background-color: #f04e47;
  border: none;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
`;

const ListStyle = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;

  strong {
    margin-right: 10px;
    flex: 1;
  }

  span {
    text-align: right;
    flex: 1;
  }
`;

const UserInfo = () => {
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
      <PersonalInfo>
        <h1
          className="text-xl font-medium text-gray-700"
          style={{ textAlign: "center", width: "100%" }}
        >
          Thông Tin Cá Nhân
        </h1>
        <InfoList>
          <ListStyle>
            <strong>Họ và tên:</strong> <span>{user.name}</span>
          </ListStyle>
          <ListStyle>
            <strong>Ngày sinh:</strong>{" "}
            <span>
              {user.dob ? new Date(user.dob).toLocaleDateString("vi-VN") : ""}
            </span>
          </ListStyle>
          <ListStyle>
            <strong>Giới tính:</strong> <span>{user.gender}</span>
          </ListStyle>
          <ListStyle>
            <strong>Số điện thoại:</strong> <span>{user.phone}</span>
          </ListStyle>
          <ListStyle>
            <strong>Địa chỉ giao hàng mặc định:</strong>{" "}
            <span>
              {user.shippingAddresses?.find((add) => add.isDefault)?.address ||
                "Chưa nhập thông tin"}
            </span>
          </ListStyle>
          <ListStyle>
            <strong>Username:</strong> <span>{user.username}</span>
          </ListStyle>
        </InfoList>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <a href="/my-info/update-info">
            <UpdateButton>Sửa thông tin cá nhân</UpdateButton>
          </a>
          <a href="/my-info/update-password">
            <UpdateButton>Đổi mật khẩu</UpdateButton>
          </a>
        </div>
      </PersonalInfo>
    </Container>
  );
};

export default UserInfo;
