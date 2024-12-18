// src/components/Product.js
import React from "react";
import Detail from "./detail";
import { useParams } from "react-router-dom";
const ProductDetail = () => {
  const { id } = useParams();
  return (
    <div>
      <Detail productId={id} />
    </div>
  );
};

export default ProductDetail;
