import Header from "@/components/Layout/HeaderCommon/Header";
import LeftSidebar from "@/components/Layout/LeftSideBarCommon/LeftSideBar";
import RightSideBar from "@/components/Layout/RightSideBarCommon/RightSideBar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen container mx-auto px-4">
      <Header />
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="hidden lg:block lg:w-[280px] bg-gray-50">
          <div className="sticky top-[74px]">
            <LeftSidebar />
          </div>
        </aside>

        <main className="flex-1 px-4 py-4 mx-auto max-w-[680px]">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:w-[280px] bg-gray-50">
          <div className="sticky top-[74px]">
            <RightSideBar />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
