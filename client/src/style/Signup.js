import styled from "styled-components";

export const SignupContainer = styled.div`
  width: 45%;
  margin: 20px auto;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputField = styled.div`
  margin: 15px 0;
`;

export const Label = styled.label`
  display: inline-block;
  font-weight: 600;
  width: 25%;
`;

export const Input = styled.input`
  padding: 15px;
  width: 60%;
`;

export const Select = styled.select`
  padding: 15px;
`;

export const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  width: 60%;
  background-color: red;
  color: #fff;
  font-weight: 600;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-left: 25%;
`;

export const Error = styled.div`
  margin-top: 10px;
  margin-left: calc(25% + 10px);
  color: red;
  font-size: 12px;
  font-weight: 600;
`;
