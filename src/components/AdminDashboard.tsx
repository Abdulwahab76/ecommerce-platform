// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "./dashboardLayout/Sidebar";
import Header from "./dashboardLayout/header";
import AdminProfileCard from "./dashboardLayout/AdminProfileCard";
import { useAuth } from "../context/AuthContext";
import { ADMIN_UID } from "../services/firebase";

const AdminDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            if (currentUser?.uid == ADMIN_UID) {
                setProfile(currentUser);
            }
        };
        loadProfile();
    }, [currentUser]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-5">
                <Header />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AdminProfileCard profile={profile} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
