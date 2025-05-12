import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { useAuthState } from "../hooks/useAuth";
import Register from "../pages/Register";

const AppRoutes: React.FC = () => {
    const { currentUser } = useAuthState();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/dashboard"
                    element={currentUser ? <Dashboard /> : <Navigate to="/register" />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
