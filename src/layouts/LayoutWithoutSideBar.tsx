import Header from "@/components/Layout/HeaderCommon/Header";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const LayoutWOSB: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 w-full">
        <main className="flex-1 px-4 py-6 mx-auto max-w-[1200px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWOSB;
