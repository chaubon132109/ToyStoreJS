import React, { useState, useEffect } from "react";
import {
  Container,
  OrderInfor,
  LeftSection,
  RightSection,
  FormGroup,
  Label,
  Textarea,
  PaymentButton,
  ProductInfo,
  OrderSummary,
  FlexAlign,
  HeaderTwo,
  HeaderThree,
  AddressSelect,
} from "../../style/OrderInformationStyles";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { toastConfig } from "../../helper/toast.config";
import { formatCurrency } from "helper/currency";

const OrderInformation = ({ items, user }) => {
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [note, setNote] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(
    items.reduce((acc, item) => acc + item.item.price * item.quantity, 0)
  );
  const [discount, setDiscount] = useState(
    items.reduce(
      (acc, item) => acc + (item.item.price * item.discount.percent) / 100,
      0
    )
  );

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await api.get(
          "http://localhost:3006/shipping-methods"
        );
        setShippingMethods(response.data.data.items);
      } catch (error) {
        toast.error("Lỗi khi lấy phương thức giao hàng", {
          style: toastConfig.errorStyle,
        });
      }
    };
    const fetchAddresses = async () => {
      try {
        const response = await api.get(`/shipping-addresses/user-id`);
        const addresses = response.data.data;
        setShippingAddresses(addresses);
        const defaultAddress = addresses.find((address) => address.isDefault);
        setSelectedAddress(defaultAddress ? defaultAddress._id : "");
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
    fetchShippingMethods();
    fetchAddresses();
  }, []);

  const handleShippingMethodChange = (event) => {
    const methodId = event.target.value;
    setShippingMethod(methodId);

    const selectedMethod = shippingMethods.find((item) => item.id === methodId);
    setShippingFee(selectedMethod ? selectedMethod.fee : 0);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    const totalAfterDiscountAndShipping = total - discount + shippingFee;
    try {
      const createOrder = await api.post("orders", {
        shipingAddressId: selectedAddress,
        paymentMethod,
        shipingMethodId: shippingMethod,
        note,
        shippingFee,
        orderDetails: items.map((item) => ({
          cartId: item._id,
          itemId: item.item._id,
          quantity: item.quantity,
          price: item.item.price,
          discount: item.discount.percent,
        })),
      });
      if (paymentMethod == 1) {
        const createPaymentUrl = await api.post("payments/create_payment_url", {
          amount: totalAfterDiscountAndShipping,
          orderDescription: createOrder.data.data._id,
        });
        window.location.href = createPaymentUrl.data.paymentUrl;
      } else {
        toast.success("Đặt hàng thành công !!!", {
          style: toastConfig.successStyle,
        });
        navigate(`/`);
      }
      //Todo: check tạo thành công mới createPaymentUrl
    } catch (error) {
      console.log("🚀 ~ handlePayment ~ error:", error);
      toast.error("Lỗi khi thanh toán", {
        style: toastConfig.errorStyle,
      });
    }
  };
  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  return (
    <Container>
      <OrderInfor>
        <LeftSection>
          <HeaderTwo>Thông tin giao hàng</HeaderTwo>
          <FormGroup>
            <Label>Địa chỉ nhận hàng:</Label>
            <AddressSelect
              value={selectedAddress}
              onChange={handleAddressChange}
            >
              {shippingAddresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.address}
                </option>
              ))}
            </AddressSelect>
          </FormGroup>
          <FormGroup>
            <Label>Phương thức thanh toán:</Label>
            <div>
              <input
                type="radio"
                id="cash"
                name="payment_method"
                value="0"
                onChange={handlePaymentMethodChange}
                required
              />
              <label htmlFor="cash">Thanh toán tiền mặt khi nhận hàng</label>
            </div>
            <div>
              <input
                type="radio"
                id="vnpay"
                name="payment_method"
                value="1"
                onChange={handlePaymentMethodChange}
                required
              />
              <label htmlFor="vnpay">Vnpay</label>
            </div>
          </FormGroup>
          <FormGroup>
            <Label>Hình thức giao hàng:</Label>
            {shippingMethods.map((method) => (
              <div key={method.id}>
                <input
                  type="radio"
                  id={method.code}
                  name="shipping_method"
                  value={method.id}
                  onChange={handleShippingMethodChange}
                  required
                />
                <label htmlFor={method.code}>
                  {method.name} - {formatCurrency(method.fee)}
                </label>
              </div>
            ))}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="note">Ghi chú:</Label>
            <Textarea
              id="note"
              name="note"
              onChange={handleNoteChange}
              value={note}
            ></Textarea>
          </FormGroup>
        </LeftSection>

        <RightSection>
          <HeaderTwo>Thông tin các mặt hàng</HeaderTwo>
          <ProductInfo>
            <table>
              <thead>
                <tr>
                  <th>Tên mặt hàng</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.item.code}>
                    <td>{item.item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {formatCurrency(
                        (item.item.price * (100 - item.discount.percent)) / 100
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProductInfo>
          <OrderSummary>
            <HeaderThree>Tổng đơn hàng</HeaderThree>
            <FlexAlign>
              <p>Tổng tiền:</p>
              <p>{formatCurrency(total)}</p>
            </FlexAlign>
            <FlexAlign>
              <p>Giảm:</p>
              <p>{formatCurrency(discount)}</p>
            </FlexAlign>
            <FlexAlign>
              <p>Giá vận chuyển:</p>
              <p>{formatCurrency(shippingFee)}</p>
            </FlexAlign>
            <FlexAlign>
              <p>Thành tiền:</p>
              <p>{formatCurrency(total - discount + shippingFee)}</p>
            </FlexAlign>
            <PaymentButton type="button" onClick={handlePayment}>
              Thanh Toán Và Đặt Hàng
            </PaymentButton>
          </OrderSummary>
        </RightSection>
      </OrderInfor>
      <Toaster
        position={toastConfig.position}
        toastOptions={{ duration: toastConfig.duration }}
      />
    </Container>
  );
};

export default OrderInformation;
