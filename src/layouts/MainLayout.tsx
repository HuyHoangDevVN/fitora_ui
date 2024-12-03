import Header from "@/components/Layout/HeaderCommon/Header";
import LeftSidebar from "@/components/Layout/LeftSideBarCommon/LeftSideBar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <LeftSidebar />
        <main className="flex-1 p-4 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
