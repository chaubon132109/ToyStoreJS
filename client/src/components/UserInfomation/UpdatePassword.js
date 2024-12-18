// UpdatePassword.js
import React, { useState } from "react";
import styled from "styled-components";
import { SidebarUI } from "./Sidebar";

const FormContainer = styled.div`
  width: 45%;
  margin-left: auto;
  margin-right: auto;
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
const Container = styled.div`
  display: flex;
`;
const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password validation and submission here
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
    } else {
      // Proceed to submit password update
    }
  };

  return (
    <Container>
      <SidebarUI></SidebarUI>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Mật khẩu cũ</Label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu cũ"
            />
          </FormGroup>
          <FormGroup>
            <Label>Mật khẩu mới</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </FormGroup>
          <FormGroup>
            <Label>Xác nhận mật khẩu</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
          </FormGroup>
          <UpdateButton type="submit">Đổi mật khẩu</UpdateButton>
        </form>
      </FormContainer>
    </Container>
  );
};

export default UpdatePassword;
