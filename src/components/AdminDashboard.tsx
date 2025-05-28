// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "./dashboardLayout/Sidebar";
import Header from "./dashboardLayout/header";
import AdminProfileCard from "./dashboardLayout/AdminProfileCard";
import Products from "./dashboardLayout/Products";
// import Orders from "./admin/Orders";
// import Users from "./admin/Users";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../services/authService";

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [selectedView, setSelectedView] = useState("profile");

    useEffect(() => {
        const loadProfile = async () => {
            if (isAdmin(user?.email)) {
                setProfile(user);
            }
        };
        loadProfile();
    }, [user]);

    const renderContent = () => {
        switch (selectedView) {
            case "profile":
                return <AdminProfileCard profile={profile} />;
            case "products":
                return <Products />;
            // case "orders":
            //     return <Orders />;
            // case "users":
            //     return <Users />;
            default:
                return <div>Select a section from the sidebar.</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar setSelectedView={setSelectedView} />
            <div className="flex-1 p-5">
                <Header />
                <div className="mt-5">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
