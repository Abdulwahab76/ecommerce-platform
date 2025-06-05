import React, { useState } from "react";
import Sidebar from "./UserDashboardLayout/sidebar";
import Header from "./AdminDashboardLayout/header";
import UserProfile from "./UserDashboardLayout/UserProfile";
import UserOrders from "./UserDashboardLayout/UserOrders";
import AccountSettings from "./UserDashboardLayout/AccountSettings";
import HelpCenter from "./UserDashboardLayout/HelpCenter";


const UserDashboard: React.FC = () => {

  const [selectedView, setSelectedView] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (selectedView) {
      case "profile":
        return <UserProfile />;
      case "orders":
        return <UserOrders />;
      case "settings":
        return <AccountSettings />;
      case "help":
        return <HelpCenter />;
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  return (
    <div>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex h-screen bg-gray-50 relative overflow-hidden">
        {/* Overlay for mobile */}
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
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col px-3">
          <div className="mt-5">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
