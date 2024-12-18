import styled from "styled-components";

export const Container = styled.div`
  margin-top: 35px;
  margin-bottom: 35px;
`;

export const OrderInfor = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  margin: 0 200px;
  padding: 39px;
`;

export const LeftSection = styled.div`
  width: 45%;
`;

export const RightSection = styled.div`
  width: 45%;
  margin-left: 5%;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  > div {
    margin-top: 20px;
    padding-left: 20px;
  }
`;

export const Label = styled.label`
  font-weight: bold;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 20px;
`;

export const PaymentButton = styled.button`
  padding: 10px 20px;
  background-color: #f04e47;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
`;

export const ProductInfo = styled.div`
  margin-top: 30px;
  table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      padding: 10px;
      border: 1px solid #ccc;
    }
    th {
      background-color: #f9f9f9;
      font-weight: bold;
    }
    tbody tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tbody tr:hover {
      background-color: #ddd;
    }
  }
`;

export const OrderSummary = styled.div`
  margin-top: 30px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  p {
    display: flex;
    justify-content: space-between;
  }
`;

export const FlexAlign = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const HeaderTwo = styled.h2`
  font-size: 24px;
  color: red;
  margin-bottom: 30px;
`;

export const HeaderThree = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;
export const AddressSelect = styled.select`
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #0066cc;
    background-color: #fff;
  }

  option {
    padding: 8px;
    background-color: #fff;
  }

  /* Mũi tên tùy chỉnh */
  &::-ms-expand {
    display: none; /* Ẩn mũi tên mặc định trên IE/Edge */
  }
`;
