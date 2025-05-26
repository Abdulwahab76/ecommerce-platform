// src/components/Sidebar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    return (
        <div className="w-64 bg-white h-full shadow-lg p-5">
            <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
            <ul className="space-y-4">
                <li onClick={() => navigate("/admin/profile")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Profile</li>
                <li onClick={() => navigate("/admin/products")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Manage Products</li>
                <li onClick={() => navigate("/admin/orders")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Manage Orders</li>
                <li onClick={() => navigate("/admin/users")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Manage Users</li>
            </ul>
        </div>
    );
};

export default Sidebar;
