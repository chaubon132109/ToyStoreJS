import React, { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import Topbar from "../Tobbar";
import api from "api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { type } from "@testing-library/user-event/dist/type";
import { useParams } from "react-router-dom";
import { formatCurrency } from "helper/currency";

const ProductFormUpdate = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesBuffer, setImagesBuffer] = useState([]);
  const [categories, setCategory] = useState([]);
  const [discounts, setDiscount] = useState([]);
  const [formData, setFormData] = useState({
    name: null,
    categoryId: null,
    age: null,
    weight: null,
    gender: null,
    description: null,
    price: null,
    discountId: null,
    stockQuantity: null,
    sku: null,
    code: null,
    length: null,
    width: null,
    height: null,
    isTiktokProduct: false,
  });

  const getProductDetail = async () => {
    try {
      const response = await api.get(`items/${id}`);
      const product = response.data.data;
      const form = {
        name: product.name,
        categoryId: product.category.id,
        age: product.age,
        weight: product.weight,
        gender: product.gender,
        description: product.description,
        price: product.price,
        discountId: product.discount.id,
        stockQuantity: product.stockQuantity,
        sku: product.sku,
        code: product.code,
        length: product.length,
        width: product.width,
        height: product.height,
        isTiktokProduct: product.isTiktokProduct,
      };
      setFormData(form);
      setImages(response.data.data.images.map((img) => img.url));
      setImage(response.data.data.images[0].url);
    } catch (error) {
      console.log("🚀 ~ getProductDetail ~ error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    getProductDetail();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("categories");
      setCategory(response.data.data.items);
      const discountResponse = await api.get("discounts");
      setDiscount(discountResponse.data.data.items);
    } catch (error) {
      console.log("🚀 ~ fetchData ~ error:", error);
    }
  };

  const CreateProduct = async () => {
    try {
      const formDataObj = new FormData();
      formDataObj.append("item", JSON.stringify(formData));
      imagesBuffer.forEach((file) => {
        formDataObj.append("images", file);
      });
      const response = await api.post("items", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files || e.target.files;
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    if (files) {
      setImagesBuffer(Array.from(files));
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (index === 0) {
      setImage(null);
    }
  };
  const handleInputChange = (e) => {
    const { value, type, checked, id } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };
  const handleChangeDescription = (e) => {
    setFormData((prev) => ({ ...prev, description: e }));
  };

  {
    console.log(formData);
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Topbar name="Tạo sản phẩm" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Preview Column */}
        <div className="col-span-4">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="bg-gray-50 rounded-lg mb-4">
                {image ? (
                  <img
                    src={images[0]}
                    alt="Product preview"
                    className="w-full object-contain"
                  />
                ) : (
                  <img
                    src="/api/placeholder/400/320"
                    alt="T-shirt preview"
                    className="w-full object-contain"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg text-gray-600">{formData.name}</h3>
                  <span className="text-sm text-gray-500">
                    {" "}
                    - {formData.code}
                  </span>
                </div>

                <div>
                  <div className="text-gray-600 mb-2">Price :</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through">
                      {formatCurrency(formData.price)}
                    </span>
                    <span className="text-lg font-medium">
                      {formatCurrency(
                        (formData.price * (100 - formData.discountPercent)) /
                          100
                      )}
                    </span>
                    <span className="text-red-600 text-sm">
                      - {formData.discountPercent} %
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-gray-600">SKU :</div>
                  <div className=" items-center gap-2">
                    <span className="text-gray-400">{formData.sku}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-gray-600">Tuổi :</div>
                  <div className=" items-center gap-2">
                    <span className="text-gray-400">{formData.age}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-gray-600">Kích thước :</div>
                  <div className=" items-center gap-2">
                    <span className="text-gray-400">
                      {`${formData.length} x ${formData.width} x ${formData.height}`}{" "}
                      m{" "}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={CreateProduct}
                  >
                    Tạo sản phẩm
                  </Button>
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                    Hủy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Form Column */}
        <div className="col-span-8">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Thêm ảnh sản phẩm
                </h2>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer"
                  onDrop={handleImageDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {images.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {images.map((img, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                      <div className="text-gray-600">
                        <span>Kéo thả ảnh của bạn vào đây, hoặc </span>
                        <span className="text-orange-500">
                          bấm vào để duyệt
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Khuyến nghị 1600 x 1200 (4:3). Các tệp PNG, JPG và GIF
                        được cho phép
                      </div>
                    </>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleImageDrop}
                    accept="image/*"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-6">
                  Thông tin sản phẩm
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-7">
                      <Label htmlFor="name" className="text-gray-600 mb-1.5">
                        Tên sản phẩm
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder=""
                        className="bg-white border-gray-200"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-5">
                      <Label
                        htmlFor="categoryId"
                        className="text-gray-600 mb-1.5"
                      >
                        Danh mục
                      </Label>
                      <select
                        id="categoryId"
                        className="w-full h-10 px-3 border border-gray-200 rounded-md"
                        onChange={handleInputChange}
                        value={formData.categoryId}
                        name="categoryId"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4">
                      <Label htmlFor="age" className="text-gray-600 mb-1.5">
                        Tuổi
                      </Label>
                      <Input
                        type="number"
                        id="age"
                        placeholder=""
                        className="bg-white border-gray-200"
                        onChange={handleInputChange}
                        value={formData.age}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="weight" className="text-gray-600 mb-1.5">
                        Khối lượng
                      </Label>
                      <Input
                        id="weight"
                        placeholder="kg"
                        className="bg-white border-gray-200"
                        onChange={handleInputChange}
                        value={formData.weight}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="gender" className="text-gray-600 mb-1.5">
                        Giới tính
                      </Label>
                      <select
                        className="w-full h-10 px-3 border border-gray-200 rounded-md"
                        onChange={handleInputChange}
                        value={formData.gender}
                      >
                        <option value={"Nam"} defaultChecked>
                          Nam
                        </option>
                        <option value={"Nữ"}>Nữ</option>
                        <option value={"Unisex"}>Nữ</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="description"
                      className="text-gray-600 mb-1.5"
                    >
                      Description
                    </Label>
                    <ReactQuill
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChangeDescription}
                      modules={{
                        toolbar: [
                          ["bold", "italic", "underline"], // Formatting
                          ["link", "image"], // Insert links/images
                          [{ list: "ordered" }, { list: "bullet" }], // Lists
                          ["clean"], // Remove formatting
                        ],
                      }}
                      formats={[
                        "bold",
                        "italic",
                        "underline",
                        "list",
                        "bullet",
                        "link",
                        "image",
                      ]}
                      className="bg-white rounded-lg shadow-lg"
                      placeholder="Write something amazing..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 mt-6">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-6">
                  Thông tin bán hàng
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-7">
                      <Label
                        htmlFor="rootPrice"
                        className="text-gray-600 mb-1.5"
                      >
                        Giá gốc
                      </Label>
                      <Input
                        id="price"
                        placeholder=""
                        className="bg-white border-gray-200"
                        onChange={handleInputChange}
                        value={formData.price}
                      />
                    </div>
                    <div className="col-span-5">
                      <Label
                        htmlFor="discountId"
                        className="text-gray-600 mb-1.5"
                      >
                        Giảm giá
                      </Label>
                      <select
                        className="w-full h-10 px-3 border border-gray-200 rounded-md"
                        onChange={handleInputChange}
                        value={formData.discountId}
                        name="discountId"
                        id="discountId"
                      >
                        {discounts.map((discount) => (
                          <option key={discount.id} value={discount.id}>
                            {`${discount.name} - ${discount.percent}%`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4">
                      <Label
                        htmlFor="stockQuantity"
                        className="text-gray-600 mb-1.5"
                      >
                        Số lượng tồn kho
                      </Label>
                      <Input
                        type="number"
                        id="stockQuantity"
                        name="stockQuantity"
                        placeholder=""
                        className="bg-white border-gray-200"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="sku" className="text-gray-600 mb-1.5">
                        SKU
                      </Label>
                      <Input
                        id="sku"
                        placeholder="kg"
                        className="bg-white border-gray-200"
                        value={formData.sku}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="code" className="text-gray-600 mb-1.5">
                        Code
                      </Label>
                      <Input
                        id="code"
                        placeholder=""
                        className="bg-white border-gray-200"
                        value={formData.code}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <input
                      className="mr-2"
                      type="checkbox"
                      name="isTiktokProduct"
                      id="isTiktokProduct"
                      value={formData.isTiktokProduct}
                      onChange={handleInputChange}
                    />
                    Có đồng bộ sản phẩm lên Tiktok
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 mt-6">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-6">
                  Thông tin giao hàng (Kích thước)
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4">
                      <Label htmlFor="length" className="text-gray-600 mb-1.5">
                        Dài
                      </Label>
                      <Input
                        type="number"
                        id="length"
                        name="length"
                        placeholder=""
                        className="bg-white border-gray-200"
                        value={formData.length}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="width" className="text-gray-600 mb-1.5">
                        Rộng
                      </Label>
                      <Input
                        id="width"
                        placeholder="m"
                        className="bg-white border-gray-200"
                        value={formData.width}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-span-4">
                      <Label htmlFor="height" className="text-gray-600 mb-1.5">
                        Cao
                      </Label>
                      <Input
                        id="height"
                        placeholder="kg"
                        className="bg-white border-gray-200"
                        value={formData.height}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductFormUpdate;
