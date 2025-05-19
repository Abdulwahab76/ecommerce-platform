import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { useAuthState } from "../hooks/useAuth";
import Register from "../pages/Register";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";

const AppRoutes: React.FC = () => {
    const { currentUser } = useAuthState();
    const { isAdmin } = useAuth();

    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* 🔐 Admin Route Protection */}
            <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
            {/* 🔐 User Route - Only accessible if not admin */}
            <Route path="/user" element={!isAdmin ? <UserDashboard /> : <Navigate to="/admin" />} />
        </Routes>

    );
};

export default AppRoutes;
