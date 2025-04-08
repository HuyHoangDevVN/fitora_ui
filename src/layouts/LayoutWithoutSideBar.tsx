import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Layout/HeaderCommon/Header";

interface LayoutProps {
  children?: ReactNode;
}

const LayoutWOSB: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen container mx-auto px-4">
      <Header />
      <div className="flex flex-col lg:flex-row gap-4">
        <main className="flex-1 px-4 max-w-[1200px] mx-auto w-full">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default LayoutWOSB;
