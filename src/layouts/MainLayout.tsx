import Header from "@/components/Layout/HeaderCommon/Header";
import LeftSidebar from "@/components/Layout/LeftSideBarCommon/LeftSideBar";
import RightSideBar from "@/components/Layout/RightSideBarCommon/RightSideBar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 w-full">
        <aside className="hidden  lg:block w-1/4 max-w-[250px] bg-gray-50">
          <LeftSidebar />
        </aside>

        <main className="flex-1 px-4 py-6 mx-auto w-full max-w-[680px]">
          <Outlet />
        </main>

        <aside className="hidden md:block lg:block w-1/4 max-w-[250px] bg-gray-50">
          <RightSideBar />
        </aside>
      </div>
    </div>
  );
};

export default Layout;
