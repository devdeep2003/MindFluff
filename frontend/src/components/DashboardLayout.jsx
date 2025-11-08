import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

const DashboardLayout = () => {
  const user = { name: "Deep Chakraborty", isOnline: true };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar user={user} />

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto"><Outlet/></div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default DashboardLayout;
