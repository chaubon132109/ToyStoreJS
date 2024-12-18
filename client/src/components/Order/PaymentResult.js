import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../../api";

const Container = styled.div`
  max-width: 28rem;
  margin: 2.5rem auto;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const MessageText = styled.p`
  font-size: 1.125rem;
  font-weight: medium;
  color: ${(props) => (props.success ? "#16a34a" : "#dc2626")};
  text-align: center;
`;

const OrderInfo = styled.p`
  font-size: 0.875rem;
  color: #4a5568; /* màu xám */
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #4f46e5; /* màu xanh chàm */
  color: white;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: medium;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4338ca; /* màu xanh chàm đậm */
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #4a5568;
`;

const PaymentResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);
        const queryString = location.search;

        if (!queryString) {
          navigate("/");
          return;
        }

        const response = await api.get(
          `http://localhost:3006/payments/vnpay_return${queryString}`
        );

        setResult(response.data);
      } catch (error) {
        console.error("Error verifying payment:", error);
        setResult({
          rspCode: "99",
          message: "Payment verification failed",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (loading) {
    return (
      <Container>
        <LoadingText>Verifying payment...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Kết quả thanh toán</Title>
      {result && (
        <div>
          <MessageText success={result.rspCode === "00"}>
            Trạng thái: {result.rspCode === "00" ? "Thành công" : "Thất bại"}
          </MessageText>
          <OrderInfo>Mã đơn hàng: {result.orderId}</OrderInfo>
          <OrderInfo>Thông báo: {result.message}</OrderInfo>
          <Button onClick={() => navigate("/")}>Quay lại thanh toán</Button>
        </div>
      )}
    </Container>
  );
};

export default PaymentResult;
