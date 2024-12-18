// ProductItem.jsx
import { formatCurrency } from "helper/currency";
import React from "react";

const ProductItem = ({ product }) => {
  return (
    <li className="item product product-item-info product-item col-lg-4 col-md-4 col-sm-4 col-xs-6 first-row-item first-sm-item first-xs-item disable_hover_effect">
      <div className="catalog-product-item">
        <div className="product-top">
          <a
            href={`/products/${product.id}`}
            style={{ paddingBottom: "100%" }}
            className="product photo product-item-photo"
            tabIndex="-1"
          >
            <img
              src={`${product.images[0].url}`}
              alt=""
              className="img-responsive product-image-photo img-thumbnail"
            />
            <div className="product-image-photo"></div>
          </a>
          {product.discount ? (
            <span className="product-label sale-label">
              <span>-{product.discount.percent}%</span>
            </span>
          ) : null}
        </div>
        <div
          className="product details product-item-details"
          style={{ width: "100%" }}
        >
          <h5 className="name product-item-name" style={{ height: "70px" }}>
            <a className="product-item-link" href={`/products/${product.id}`}>
              {product.name}
            </a>
          </h5>
          <div className="price-box price-final_price">
            {product.discount ? (
              <>
                <span className="special-price">
                  <span className="price">
                    {formatCurrency(
                      (product.price * (100 - product.discount.percent)) / 100
                    )}
                  </span>
                </span>
                <span className="old-price">
                  <span className="price">{formatCurrency(product.price)}</span>
                </span>
              </>
            ) : (
              <span className="price">{formatCurrency(product.price)}</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductItem;
