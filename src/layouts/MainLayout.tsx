import Header from "@/components/Layout/HeaderCommon/Header";
import LeftSidebar from "@/components/Layout/LeftSideBarCommon/LeftSideBar";
import RightSideBar from "@/components/Layout/RightSideBarCommon/RightSideBar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <LeftSidebar />
        <RightSideBar />
        <main className="flex-1 p-4 mx-auto w-[680px] max-w-[680px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
