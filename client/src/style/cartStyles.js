import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 200px;
  background: white;
  padding: 45px 30px;
  min-height: 600px;
`;

export const LeftContainer = styled.div`
  width: 45%;
`;

export const RightContainer = styled.div`
  width: 45%;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 35px;
  tr {
    border-top: 1px solid #ccc;
  }
`;

export const ProductName = styled.div`
  padding-top: 25px;
  margin-bottom: 25px;
  font-weight: 600;
`;

export const FlexAlign = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 0px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 20px;
`;

export const DiscountText = styled.p`
  color: grey;
`;

export const PriceFinal = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: red;
`;

export const Price = styled.div`
  font-size: 20px;
  font-weight: 600;
  opacity: 0.4;
  text-decoration: line-through;
`;

export const PaymentButton = styled.button`
  cursor: pointer;
  width: 100%;
  background-color: #f04e47 !important;
  margin-top: 20px;
  border: none;
  font-weight: 600;
  color: #fff;
  font-size: 16px;
  padding: 15px 0px;
`;

export const ContinueButton = styled.button`
  cursor: pointer;
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid grey;
  font-weight: 600;
  width: 200px;
`;

export const ErrorMessage = styled.div`
  margin-top: 20px;
  font-weight: 600;
  color: red;
`;

export const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
`;

export const QuantityButton = styled.button`
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const QuantityInput = styled.input`
  width: 30px;
  padding: 5px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #007bff;
    background-color: #fff;
  }

  -moz-appearance: textfield;
  -webkit-appearance: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`;

export const InputAddress = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
`;

export const CloseButton = styled.button`
  margin-top: 10px;
  background-color: red;
  color: white;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  margin-top: 10px;
  background-color: green;
  color: white;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
