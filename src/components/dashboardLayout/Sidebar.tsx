// src/pages/dashboardLayout/Sidebar.tsx
import React from "react";

interface SidebarProps {
    setSelectedView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedView }) => {
    return (
        <div className="w-64 bg-white h-full shadow-lg p-5">
            <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
            <ul className="space-y-4">
                <li onClick={() => setSelectedView("profile")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Profile</li>
                <li onClick={() => setSelectedView("products")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Manage Products</li>
                <li onClick={() => setSelectedView("orders")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Manage Orders</li>
                <li onClick={() => setSelectedView("users")} className="cursor-pointer hover:bg-gray-200 p-2 rounded-md">Manage Users</li>
            </ul>
        </div>
    );
};

export default Sidebar;
