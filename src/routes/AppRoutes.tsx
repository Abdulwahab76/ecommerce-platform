import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes: React.FC = () => {
    const { currentUser, isAdmin } = useAuth();

    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/login"
                element={
                    !currentUser ? (
                        <Login />
                    ) : isAdmin ? (
                        <Navigate to="/admin" />
                    ) : (
                        <Navigate to="/user" />
                    )
                }
            />
            <Route path="/register" element={<ProtectedRoute>
                <Register />
            </ProtectedRoute>} />
            {/* 🔐 Admin Route Protection */}
            <Route path="/admin" element={<ProtectedRoute>
                <AdminDashboard />
            </ProtectedRoute>} />
            {/* 🔐 User Route - Only accessible if not admin */}
            <Route path="/user" element={<ProtectedRoute> <UserDashboard /></ProtectedRoute>} />
        </Routes>

    );
};

export default AppRoutes;
