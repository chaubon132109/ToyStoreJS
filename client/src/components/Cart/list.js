import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import {
  Container,
  LeftContainer,
  RightContainer,
  Table,
  ProductName,
  FlexAlign,
  DiscountText,
  PriceFinal,
  PaymentButton,
  ContinueButton,
  ErrorMessage,
  QuantityWrapper,
  QuantityButton,
  QuantityInput,
  PaginationContainer,
  Button,
  PageInfo,
  Modal,
  ModalContent,
  InputAddress,
  CloseButton,
  SubmitButton,
  Price,
} from "../../style/cartStyles";
import toast, { Toaster } from "react-hot-toast";
import { toastConfig } from "../../helper/toast.config";
import { Dialog } from "@components/ui/dialog";
import { DialogContent } from "@components/ui/dialog";
import { DialogHeader } from "@components/ui/dialog";
import { DialogTitle } from "@components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "@components/ui/input";
import { DialogFooter } from "@components/ui/dialog";
import { formatCurrency } from "helper/currency";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, [currentPage]);

  useEffect(() => {
    calculateTotal();
    calculateDiscount();
  }, [selectedItems]); // Khi selectedItems thay đổi, tính lại tổng tiền và giảm giá.

  const fetchCartItems = async () => {
    try {
      const response = await api.get(
        `carts/get-cart-by-user?page=${currentPage}&limit=${itemsPerPage}`
      );
      setItems(response.data.data.items);
      console.log(response);
      setTotalPages(response.data.data.meta.total[0].count);
      setSelectedItems([]); // Reset selected items khi thay đổi trang
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const fetchDefaultAddress = async () => {
    try {
      const response = await api.get("shipping-addresses/default");
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lọc dia chi mac dinh:", error);
    }
  };

  const calculateTotal = () => {
    const totalPrice = selectedItems.reduce(
      (acc, item) => acc + item.item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  };

  const calculateDiscount = () => {
    const totalDiscount = selectedItems
      .reduce(
        (acc, item) =>
          acc +
          (item.discount?.percent * item.item.price * item.quantity) / 100,
        0
      )
      .toFixed(0);
    setDiscount(totalDiscount);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const validateCartQuantities = () => {
    return selectedItems.every((item) => item.quantity <= item.stock);
  };

  const handleCheckout = (event) => {
    if (!validateCartQuantities()) {
      event.preventDefault();
      setErrorMessage("Lỗi: Số lượng sản phẩm vượt quá số lượng hiện có.");
    } else {
      setErrorMessage("");
      navigate("/checkout");
    }
  };
  const handleCreateOrder = async () => {
    const defaultAddress = await fetchDefaultAddress();
    const itemSelectedIds = selectedItems.map((item) => item._id);
    if (!itemSelectedIds.length > 0) {
      toast.error(`Chọn ít nhất một sản phẩm`, {
        style: toastConfig.errorStyle,
      });
    } else if (!defaultAddress) {
      toast.error(`Vui lòng nhập địa chỉ mặc định`, {
        style: toastConfig.errorStyle,
      });
      setModalVisible(true);
    } else {
      navigate(`/create-order?ids=${itemSelectedIds.join(",")}`);
    }
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Cập nhật giá trị input khi người dùng nhập
  };
  const handleAddressSubmit = async () => {
    try {
      const response = await api.post("shipping-addresses", {
        address: address,
        name: name,
        phone: phone,
      });
      if (response.data.statusCode !== 200) {
        toast.error("Lỗi khi tạo địa chỉ mặc định", {
          style: toastConfig.errorStyle,
        });
      } else {
        toast.success("Địa chỉ mặc định đã được tạo thành công", {
          style: toastConfig.successStyle,
        });
        setModalVisible(false); // Đóng modal sau khi tạo địa chỉ thành công
        handleCreateOrder(); // Tạo đơn hàng sau khi tạo địa chỉ
      }
    } catch (error) {
      toast.error("Lỗi khi tạo địa chỉ", {
        style: toastConfig.errorStyle,
      });
      console.error("Lỗi khi tạo địa chỉ:", error);
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = prevSelectedItems.some(
        (selectedItem) => selectedItem.item?._id === item?.item?._id
      )
        ? prevSelectedItems.filter(
            (selectedItem) => selectedItem.item?._id !== item?.item?._id
          )
        : [...prevSelectedItems, item];

      // Tính toán lại tổng tiền và giảm giá mỗi khi thay đổi selectedItems
      calculateTotal();
      calculateDiscount();

      return updatedSelectedItems;
    });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleQuantityBlue = async (e, item) => {
    let newQuantity = e.target.value;
    if (newQuantity && newQuantity > 0) {
      newQuantity = parseInt(newQuantity, 10);
    } else {
      newQuantity = parseInt(item.quantity, 10);
    }
    setItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem?.item?._id === item?.item?._id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );

    // Nếu sản phẩm này đang được chọn, cập nhật lại số lượng trong selectedItems
    if (
      selectedItems.some(
        (selectedItem) => selectedItem.item?._id === item.item?._id
      )
    ) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.map((selectedItem) =>
          selectedItem.item?._id === item.item?._id
            ? { ...selectedItem, quantity: newQuantity }
            : selectedItem
        )
      );
    }

    // Cập nhật lại số lượng qua API
    try {
      await api.put("carts/update-quantity", {
        cartId: item?._id,
        quantity: newQuantity,
      });

      // Sau khi cập nhật số lượng, tính lại tổng tiền và giảm giá
      // calculateTotal();
      // calculateDiscount();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const handleQuantityChange = async (e, item) => {
    let newQuantity = e.target.value;
    newQuantity = parseInt(newQuantity, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    setItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.item?._id === item.item?._id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );

    // Nếu sản phẩm này đang được chọn, cập nhật lại số lượng trong selectedItems
    if (
      selectedItems.some(
        (selectedItem) => selectedItem.item?._id === item.item?._id
      )
    ) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.map((selectedItem) =>
          selectedItem.item?._id === item.item?._id
            ? { ...selectedItem, quantity: newQuantity }
            : selectedItem
        )
      );
    }

    // Cập nhật lại số lượng qua API
    try {
      await api.put("carts/update-quantity", {
        cartId: item?._id,
        quantity: newQuantity,
      });

      // Sau khi cập nhật số lượng, tính lại tổng tiền và giảm giá
      // calculateTotal();
      // calculateDiscount();
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    handleQuantityChange({ target: { value: newQuantity } }, item);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      handleQuantityChange({ target: { value: newQuantity } }, item);
    }
  };

  return (
    <Container>
      <LeftContainer>
        <h2>Giỏ hàng</h2>
        {items.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          <Table>
            <tbody>
              {items.map((item) => (
                <tr key={item.item?._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.some(
                        (selectedItem) =>
                          selectedItem.item?._id === item.item?._id
                      )}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </td>
                  <td style={{ width: "10%" }}>
                    <Link to={`/products/${item.item?._id}`}>
                      <img
                        src={`${item.images[0]?.url}`}
                        alt={item.item?.name}
                        style={{ width: "100%" }}
                      />
                    </Link>
                  </td>
                  <td>
                    <ProductName style={{ marginLeft: "10px" }}>
                      {item.item?.name}
                    </ProductName>
                  </td>
                  <td>
                    <QuantityWrapper>
                      <QuantityButton onClick={() => handleDecrement(item)}>
                        -
                      </QuantityButton>
                      <QuantityInput
                        type="number"
                        value={item?.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(e, item)}
                        onBlur={(e) => handleQuantityBlue(e, item)}
                      />
                      <QuantityButton onClick={() => handleIncrement(item)}>
                        +
                      </QuantityButton>
                    </QuantityWrapper>
                  </td>
                  <td>
                    <Price>{formatCurrency(item.item?.price)}</Price>
                    <PriceFinal>
                      {formatCurrency(
                        item.item?.price * (1 - item.discount?.percent / 100)
                      )}
                    </PriceFinal>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <PaginationContainer>
          <ContinueButton onClick={handleContinueShopping}>
            Tiếp tục mua sắm
          </ContinueButton>
        </PaginationContainer>
        <PaginationContainer>
          <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Trang trước
          </Button>
          <PageInfo>
            Trang {currentPage} / {totalPages}
          </PageInfo>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Trang sau
          </Button>
        </PaginationContainer>
      </LeftContainer>
      <RightContainer>
        <h2>TÓM TẮT ĐƠN HÀNG</h2>
        <div>
          <FlexAlign>
            <p>Tổng tiền:</p>
            <p>{formatCurrency(total)}</p>
          </FlexAlign>
          <FlexAlign>
            <p>Giảm:</p>
            <DiscountText>{formatCurrency(discount)}</DiscountText>
          </FlexAlign>
          <FlexAlign>
            <p>Số tiền phải thanh toán:</p>
            <p>{formatCurrency(total - discount)}</p>
          </FlexAlign>
        </div>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <PaymentButton onClick={handleCreateOrder}>Đặt hàng</PaymentButton>
      </RightContainer>
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Nhập địa chỉ mặc định</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddressSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name || !phone || !address}>
                Tạo địa chỉ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* {modalVisible && (
        <Modal>
          <ModalContent>
            <h2 style={{ marginBottom: "20px" }}>Nhập địa chỉ mặc định</h2>
            <InputAddress
              type="text"
              placeholder="Nhập địa chỉ của bạn"
              value={inputValue}
              onChange={handleInputChange}
            />
            <div>
              <SubmitButton
                disabled={!inputValue}
                onClick={handleAddressSubmit}
              >
                Tạo địa chỉ
              </SubmitButton>
              <CloseButton onClick={() => setModalVisible(false)}>
                Đóng
              </CloseButton>
            </div>
          </ModalContent>
        </Modal>
      )} */}
      <Toaster
        position={toastConfig.position}
        toastOptions={{
          duration: toastConfig.duration,
        }}
      />
    </Container>
  );
};

export default Cart;
