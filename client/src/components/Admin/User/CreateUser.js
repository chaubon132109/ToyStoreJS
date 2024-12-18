import { useState } from "react";
import { Button } from "../../../@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import Topbar from "../Tobbar";
import { Calendar, Mail, Phone, User, UserCircle } from "lucide-react";
import api from "api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { toastConfig } from "helper/toast.config";

export default function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "",
    phone: "",
    gender: "",
    birthDate: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    try {
      const response = await api.post("/users", formData);
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      toast.error(error, {
        style: toastConfig.errorStyle,
      });
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      <Topbar name="Tạo người dùng mới" />
      <Card className="w-full max-w-2xl mx-auto bg-white p-6">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Tên người dùng</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="code"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Nhập username"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password1"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Nhập password"
                      className="pl-10"
                      type="password"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                    className="bg-white"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-lg">
                      <SelectItem value="1">User</SelectItem>
                      <SelectItem value="0">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-lg">
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                      <SelectItem value="khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Ngày sinh</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Tạo người dùng
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Toaster
        position={toastConfig.position}
        toastOptions={{
          duration: toastConfig.duration,
        }}
      />
    </div>
  );
}
