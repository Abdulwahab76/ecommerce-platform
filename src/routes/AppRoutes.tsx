import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import VerifyEmail from "../components/VerifyEmail";
import ProductPage from "../pages/ProductPage";
import CategoryPage from "../components/pages/Home/CategoryPage";
import CheckoutPage from "../components/CheckoutPage";
import SuccessPage from "../components/SuccessPage";
import ProductFilterPage from "../components/ProductFilterPage";
import ForgotPassword from "../components/ForgotPassword";

const AppRoutes: React.FC = () => {
    const { user, isAdmin } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
                path="/login"
                element={
                    !user ? (
                        <Login />
                    ) : isAdmin ? (
                        <Navigate to="/admin" replace />
                    ) : (
                        <Navigate to="/user" replace />
                    )
                }
            />
            <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/" replace />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user"
                element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/shop" element={<ProductFilterPage />} />

            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
    );
};

export default AppRoutes;
