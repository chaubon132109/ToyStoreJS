import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { toastConfig } from "../../helper/toast.config";
import { Card, CardContent } from "../ui/card";
import Slider from "react-slick";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "helper/currency";
import { Badge } from "@components/ui/badge";
import { Dialog } from "@components/ui/dialog";
import { DialogContent } from "@components/ui/dialog";
import { DialogHeader } from "@components/ui/dialog";
import { DialogTitle } from "@components/ui/dialog";
import { DialogDescription } from "@components/ui/dialog";

const ProductContainer = styled.div`
  margin: 50px 250px;
  padding: 30px;
  background-color: #fff;
`;

const ProductDetails = styled.div`
  display: flex;
  gap: 60px;
`;

const ProductImages = styled.div`
  width: 380px;
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  width: auto;
  height: 380px;
  max-width: 380px;
  max-height: 380px;
  object-fit: contain;
`;

const SlideButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  background-color: transparent;
  border: none;
  color: #000;
  cursor: pointer;

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }
`;

const ProductInfo = styled.div`
  width: 50%;
`;

const Title = styled.h2`
  margin-top: 0;
`;

const PriceNew = styled.p`
  font-weight: 600;
  color: red;
`;

const PriceOld = styled.p`
  text-decoration: line-through;
  color: #888;
`;

const Discount = styled.p`
  font-weight: 600;
  color: green;
`;

const TrustSealList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const TrustSealItem = styled.li`
  border: 1px solid black;
  padding: 10px;
  font-style: ${({ italic }) => (italic ? "italic" : "normal")};
`;

const QuantityButton = styled.button`
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #beb6b6;
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 30px;
  margin: 0 20px;
  text-align: center;
`;

const ProductButtons = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Button = styled.button`
  cursor: pointer;
  margin-right: 10px;
  padding: 10px 40px;
  background-color: red;
  color: #fff;
  font-weight: 600;
  border: none;
`;

const ProductDescription = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  ul {
    list-style-type: disc;
    padding-left: 20px;
  }
`;

const CustomTable = styled.table`
  width: 100%;

  margin-bottom: 20px;

  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
  }
  td:first-child {
    font-weight: bold;
  }
  td:last-child {
    text-align: end;
  }
  tr:nth-child(odd) {
    background-color: #ffbbbb; /* Màu nhạt hơn */
  }

  tr:nth-child(even) {
    background-color: #ffffff; /* Màu trắng */
  }
`;

const CommentSection = styled.div`
  margin-bottom: 20px;
`;

const CommentForm = styled.form`
  margin-bottom: 20px;

  textarea {
    width: 100%;
    height: 100px;
  }
`;

const CommentItem = styled.li`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid grey;

  .author {
    font-weight: bold;
  }

  .timestamp {
    font-style: italic;
    font-size: 0.8em;
    color: #888;
    margin-left: 50px;
  }

  .content {
    margin-top: 20px;
    padding-left: 20px;
  }
`;

const SubmitCommentButton = styled.button`
  padding: 10px;
  width: 150px;
  background-color: blue;
  font-weight: 600;
  color: white;
  border: none;
`;
const RelatedProducts = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
  }
`;

const RelatedProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const RelatedProductCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .content {
    padding: 12px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    p {
      font-size: 14px;
      color: #e53935;
      font-weight: 500;
    }
  }
`;
const Detail = ({ productId }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(true);
  const [product, setProduct] = useState({});
  const [comments, setComments] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/items/${productId}`);
      const productData = response.data.data;
      setProduct(productData);

      // Gọi fetchRelatedProducts với categoryId của sản phẩm
      await fetchRelatedProducts(productData.category.id);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchRelatedProducts = async (categoryId) => {
    try {
      const response = await api.get(`/items`, {
        params: {
          filter: JSON.stringify([{ column: "categoryId", text: categoryId }]),
        },
      });

      // Lọc sản phẩm liên quan và chỉ lấy 4 sản phẩm
      const relatedItems = response.data.data.items.filter(
        (item) => item.id !== productId
      );

      setRelatedProducts(relatedItems);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm liên quan:", error);
    }
  };

  const fetchComments = (page = 1, limit = 5) => {
    api
      .get(`/comments/item?itemId=${productId}&page=${page}&limit=${limit}`)
      .then((response) => {
        setComments(response.data.data.items);
        setTotalPages(
          Math.ceil(response.data.data.meta.total[0].count / limit)
        ); // Tính tổng số trang
      })
      .catch((error) => console.error("Lỗi khi lấy bình luận:", error));
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);

  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1);
  const handleDecreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleQuantityChange = (e) => setQuantity(parseInt(e.target.value));
  const changeSlide = (n) =>
    setCurrentSlide(
      (prev) => (prev + n + product.images.length) % product.images.length
    );

  const handleCommentChange = (e) => setCommentContent(e.target.value);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentContent.trim() === "") {
      alert("Vui lòng nhập nội dung bình luận.");
      return;
    }

    api
      .post("/comments", { itemId: productId, content: commentContent })
      .then(() => {
        fetchComments(currentPage);
        setCommentContent("");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi bình luận:", error);
        alert("Gửi bình luận thất bại.");
      });
  };
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error(`Vui lòng đăng nhập`, {
        style: toastConfig.errorStyle,
      });
      navigate("/login");
      return;
    } else if (quantity > product.stockQuantity) {
      setIsPopupOpen(true);
    } else {
      const body = {
        itemId: productId,
        quantity: quantity,
      };

      api
        .post("/carts/add-to-cart", body)
        .then(() => {
          toast.success(`Thêm sản phẩm vào giỏ hàng thành công`, {
            style: toastConfig.successStyle,
          });
        })
        .catch((error) => {
          console.error("Lỗi khi thêm vào giỏ hàng:", error);
          toast.error(`Lỗi khi thêm giỏ hàng`, {
            style: toastConfig.errorStyle,
          });
        });
    }
  };
  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      toast.error(`Vui lòng đăng nhập`, {
        style: toastConfig.errorStyle,
      });
      navigate("/login");
      return;
    } else if (quantity > product.stockQuantity) {
      setIsPopupOpen(true);
    } else {
      const body = {
        itemId: productId,
        quantity: quantity,
      };
      const createCart = await api.post("/carts/add-to-cart", body);
      if (createCart.data.statusCode !== 200) {
        toast.error(`Lỗi khi mua hàng`, {
          style: toastConfig.errorStyle,
        });
      } else {
        navigate(`/create-order?ids=${createCart.data.data._id}`);
      }

      // api
      //   .post("/carts/add-to-cart", body)
      //   .then(() => {
      //     toast.success(`Thêm sản phẩm vào giỏ hàng thành công`, {
      //       style: toastConfig.successStyle,
      //     });
      //   })
      //   .catch((error) => {
      //     console.error("Lỗi khi thêm vào giỏ hàng:", error);
      //     toast.error(`Lỗi khi thêm giỏ hàng`, {
      //       style: toastConfig.errorStyle,
      //     });
      //   });
    }
  };
  const handleAddToCart1 = (productId1) => {
    if (!isLoggedIn) {
      toast.error(`Vui lòng đăng nhập`, {
        style: toastConfig.errorStyle,
      });
      navigate("/login");
      return;
    }

    const body = {
      itemId: productId1,
      quantity: 1,
    };

    api
      .post("/carts/add-to-cart", body)
      .then(() => {
        toast.success(`Thêm sản phẩm vào giỏ hàng thành công`, {
          style: toastConfig.successStyle,
        });
      })
      .catch((error) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        toast.error(`Lỗi khi thêm giỏ hàng`, {
          style: toastConfig.errorStyle,
        });
      });
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: window.location.pathname } });
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <ProductContainer>
      <ProductDetails>
        <ProductImages>
          {product.images &&
            product.images.map((img, index) => (
              <div
                key={index}
                style={{ display: index === currentSlide ? "block" : "none" }}
              >
                <Image src={img.url} alt={`Image ${index + 1}`} />
              </div>
            ))}
          <SlideButton className="prev" onClick={() => changeSlide(-1)}>
            &#10094;
          </SlideButton>
          <SlideButton className="next" onClick={() => changeSlide(1)}>
            &#10095;
          </SlideButton>
        </ProductImages>

        <ProductInfo>
          <Title>{product.name}</Title>
          {product.discount?.percent > 0 ? (
            <>
              <PriceNew>
                Giá khuyến mãi:{" "}
                {(product.price * (100 - product.discount.percent)) / 100}
              </PriceNew>
              <PriceOld>Giá gốc: {product.price}</PriceOld>
              <Discount>Khuyến mãi: {product.discount.percent}%</Discount>
            </>
          ) : (
            <PriceNew>Giá gốc: {product.price}</PriceNew>
          )}
          <TrustSealList>
            <TrustSealItem>Hàng chính hãng, chứng nhận an toàn</TrustSealItem>
            <TrustSealItem italic>
              Miễn phí giao hàng toàn quốc đơn trên 500K
            </TrustSealItem>
            <TrustSealItem>
              Liên hệ hỗ trợ: <a href="tel:19001208">1900.1208</a>
            </TrustSealItem>
          </TrustSealList>

          <QuantityButton onClick={handleDecreaseQuantity}>-</QuantityButton>
          <QuantityInput
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <QuantityButton onClick={handleIncreaseQuantity}>+</QuantityButton>

          <ProductButtons>
            <Button onClick={handleBuyNow}>Mua ngay</Button>
            <Button onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>
          </ProductButtons>
        </ProductInfo>
      </ProductDetails>
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Số lượng vượt quá tồn kho</DialogTitle>
            <DialogDescription>
              Số lượng bạn muốn mua vượt quá số lượng hàng còn trong kho. Vui
              lòng giảm số lượng.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleClosePopup}>Đóng</Button>
        </DialogContent>
      </Dialog>

      <ProductDescription>
        <h2>Mô tả sản phẩm</h2>
        <div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: product?.description }}
        />
      </ProductDescription>

      <CustomTable>
        <tbody>
          <tr>
            <td>Tên sản phẩm</td>
            <td>{product.name}</td>
          </tr>
          <tr>
            <td>Danh mục</td>
            <td>{product.category?.name}</td>
          </tr>
          <tr>
            <td>Tuổi</td>
            <td>{product.age} tuổi trở lên</td>
          </tr>
          <tr>
            <td>Giới tính</td>
            <td>{product.gender}</td>
          </tr>
          <tr>
            <td>Số lượng hàng còn</td>
            <td>{product.stockQuantity}</td>
          </tr>
        </tbody>
      </CustomTable>

      <CommentSection>
        <ul>
          <h2>Các bình luận về sản phẩm</h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <CommentItem key={index}>
                <span className="author">{comment.user?.name}</span>
                <span className="timestamp">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
                <div className="content">{comment.content}</div>
              </CommentItem>
            ))
          ) : (
            <p>Chưa có bình luận nào.</p>
          )}
        </ul>

        <div className="pagination">
          <Button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage((prevPage) => prevPage - 1);
                fetchComments(currentPage - 1);
              }
            }}
          >
            Trước
          </Button>
          {/* <span>{` ${currentPage} - ${totalPages}`}</span> */}
          <Button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage((prevPage) => prevPage + 1);
                fetchComments(currentPage + 1);
              }
            }}
          >
            Tiếp theo
          </Button>
        </div>

        {isLoggedIn ? (
          <CommentForm onSubmit={handleSubmitComment}>
            <textarea
              value={commentContent}
              onChange={handleCommentChange}
              className="border-4 mt-4 p-2"
              placeholder="Nhập bình luận của bạn..."
            />
            <SubmitCommentButton type="submit">
              Gửi bình luận
            </SubmitCommentButton>
          </CommentForm>
        ) : (
          <button onClick={handleLoginRedirect}>Đăng nhập để bình luận</button>
        )}
      </CommentSection>
      <section className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Sản phẩm liên quan
        </h2>
        <Slider {...sliderSettings}>
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="px-2">
              <Card
                className="cursor-pointer transition-transform duration-200 hover:scale-105 relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(true)}
                onClick={() => {
                  navigate(`/products/${relatedProduct.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                {relatedProduct.discount.percent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
                    -{relatedProduct.discount.percent}%
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                    <img
                      src={relatedProduct.images[0]?.url}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[4rem]">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex flex-col mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(
                          relatedProduct.price *
                            (1 - relatedProduct.discount.percent / 100)
                        )}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-800"
                      >
                        Tiết kiệm{" "}
                        {formatCurrency(
                          relatedProduct.price *
                            (relatedProduct.discount.percent / 100)
                        )}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(relatedProduct.price)}
                    </span>
                  </div>
                  {isHovered && (
                    <Button
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart1(relatedProduct.id);
                      }}
                    >
                      Thêm vào giỏ
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      </section>

      <Toaster
        position={toastConfig.position}
        toastOptions={{
          duration: toastConfig.duration,
        }}
      />
    </ProductContainer>
  );
};

export default Detail;
