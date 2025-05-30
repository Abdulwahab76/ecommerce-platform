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
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
    );
};

export default AppRoutes;
