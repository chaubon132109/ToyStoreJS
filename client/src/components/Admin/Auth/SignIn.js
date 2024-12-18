import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Checkbox } from "../../../@components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Image, Lock } from "lucide-react";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginAdminForm() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Khai báo useNavigate
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3006/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role !== 0)
          return setError("Vui lòng đăng nhập bằng tài khoản admin!");
        login(data);
        navigate("/admin/dashboard");
      } else {
        setError(
          "Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản và mật khẩu."
        );
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Card className="w-full max-w-md mx-auto self-center shadow-none border-0">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-orange-500" />
            ToyStore
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
          <p className="text-muted-foreground text-sm">
            Hãy đăng nhập để truy cập trang quản trị
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Tên đăng nhập</Label>
            <Input
              id="username"
              placeholder="Nhập tên đăng nhập "
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Button variant="link" className="px-0 text-orange-500">
                Quên mật khẩu ?
              </Button>
            </div>
            <Input
              id="password"
              placeholder="Nhập mặt khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nhớ mật khẩu
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <Button
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Đăng nhập
          </Button>
        </CardContent>
      </Card>
      <div className="hidden lg:block bg-zinc-50 relative text-left">
        <img
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSosZN-e_hIDsf2U176Hf8QNMDO-k9d61ywAw&s"
          }
          alt={""}
          className="object-cover"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
