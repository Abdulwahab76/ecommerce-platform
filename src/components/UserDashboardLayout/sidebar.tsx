// src/pages/UserDashboardLayout/Sidebar.tsx
import React from "react";

interface Props {
    setSelectedView: (view: string) => void;
}

const Sidebar: React.FC<Props> = ({ setSelectedView }) => {
    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold mb-4">User Panel</h2>
            <button onClick={() => setSelectedView("profile")} className="block w-full text-left">Profile Overview</button>
            <button onClick={() => setSelectedView("orders")} className="block w-full text-left">My Orders</button>
            <button onClick={() => setSelectedView("settings")} className="block w-full text-left">Account Settings</button>
            <button onClick={() => setSelectedView("help")} className="block w-full text-left">Support / Help</button>
        </div>
    );
};

export default Sidebar;
