import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderInformation from "./OrderInformation";
import toast from "react-hot-toast";
import { toastConfig } from "../../helper/toast.config";
import { useLocation } from "react-router-dom";
import api from "../../api";

const OrderContainer = () => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [ids, setIds] = useState([]);
  const [user, setUser] = useState({});
  useEffect(() => {
    // Lấy giá trị 'ids' từ URL
    const searchParams = new URLSearchParams(location.search);
    const idsParam = searchParams.get("ids");

    if (idsParam) {
      const idsArray = idsParam.split(",");
      setIds(idsArray); // Thiết lập ids trong state
    }
  }, [location.search]); // Cập nhật khi URL thay đổi

  useEffect(() => {
    // Chỉ gọi API khi `ids` đã được thiết lập
    const fetchCartDetails = async () => {
      try {
        const response = await api.get("carts/get-cart-by-ids", {
          params: { ids: ids.join(",") },
        });
        const data = response.data.data.items;
        setItems(data.data);
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching cart details:", error);
        toast.error("Lỗi khi tạo order", {
          style: toastConfig.errorStyle,
        });
      }
    };

    if (ids.length) {
      fetchCartDetails();
    }
  }, [ids]); // Gọi API khi `ids` thay đổi
  return items.length ? (
    <OrderInformation items={items} user={user} />
  ) : (
    toast.error("Hãy chọn sản phẩm", { style: toastConfig.errorStyle })
  );
};

export default OrderContainer;
