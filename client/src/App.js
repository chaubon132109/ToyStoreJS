import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/Homepage/Homepage";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./components/Login/Login";
import ProductList from "./components/Product/productList";
import ProductDetail from "./components/Product/productDetail";
import ListCart from "./components/Cart/ListCart";
import OrderContainer from "./components/Order";
import PaymentResult from "./components/Order/PaymentResult";
import SignupPage from "./components/Signup/Signup";
import UserInfo from "./components/UserInfomation/UserInfor";
import UpdatePassword from "./components/UserInfomation/UpdatePassword";
import UpdateUserInfo from "./components/UserInfomation/UpdateUserInfo";
import AdminPage from "./components/Admin/AdminPage";
import AddNewProduct from "./components/Admin/Product/CreateProduct";
import ProductDetails from "./components/Admin/Product/DetailProduct";
import ProductListAdmin from "./components/Admin/Product/AdminProductManagement";
import OrderDashboard from "./components/Admin/Order/OrderList";
import OrderDetails from "./components/Admin/Order/OrderDetail";
import LoginAdminForm from "./components/Admin/Auth/SignIn";
import UserList from "./components/Admin/User/UserList";
import CategoryList from "./components/Admin/Category/CategoryList";
import CommentManagement from "./components/Admin/Comment/CommentList";
import DiscountCodesManagement from "./components/Admin/Discount/DiscountList";
import PaymentManagement from "./components/Admin/Payment/PaymentList";
import NotFound from "./components/NotFound";
import OrderHistory from "./components/UserInfomation/OrderHistoryList";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Home from "./components/Homepage2/Homepage2";
import ProductFormUpdate from "./components/Admin/Product/UpdateProduct";
import CreateUser from "./components/Admin/User/CreateUser";

function AppContent() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login/admin");
  const isNotFound = location.pathname === "*";

  return (
    <div className="App">
      {!isAdminRoute && !isNotFound && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ListCart />} />
        <Route path="/create-order" element={<OrderContainer />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/my-info" element={<UserInfo />} />
        <Route path="/my-order" element={<OrderHistory />} />
        <Route path="/login/admin" element={<LoginAdminForm />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductListAdmin />} />
          <Route path="products/create" element={<AddNewProduct />} />
          <Route path="products/detail/:id" element={<ProductDetails />} />
          <Route path="products/update/:id" element={<ProductFormUpdate />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="orders" element={<OrderDashboard />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="users" element={<UserList />} />
          <Route path="comments" element={<CommentManagement />} />
          <Route path="discounts" element={<DiscountCodesManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/my-info/update-password" element={<UpdatePassword />} />
        <Route path="/my-info/update-info" element={<UpdateUserInfo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && !isNotFound && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
