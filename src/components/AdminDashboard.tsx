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
import Users from "./dashboardLayout/users";
import Orders from "./dashboardLayout/orders";

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [selectedView, setSelectedView] = useState("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // NEW

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
            case "orders":
                return <Orders />;
            case "users":
                return <Users />;
            default:
                return <div>Select a section from the sidebar.</div>;
        }
    };

    return (
        <div  >

            <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />


            {/* Mobile sidebar overlay */}
            <div className="flex h-screen bg-gray-100 relative overflow-hidden">
                <div
                    className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        } md:hidden`}
                    onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar */}
                <div
                    className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <Sidebar
                        setSelectedView={(view) => {
                            setSelectedView(view);
                            setIsSidebarOpen(false); // Close sidebar on selection (mobile)
                        }}
                    />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col p-5  ">
                    <div className="mt-5">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboard;
