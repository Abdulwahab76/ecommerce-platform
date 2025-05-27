// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
    const { user, isAdmin } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

    if (adminOnly && !isAdmin) return <Navigate to="/user" replace />;

    if (!adminOnly && isAdmin) return <Navigate to="/admin" replace />;

    return <>{children}</>;
};

export default ProtectedRoute;
