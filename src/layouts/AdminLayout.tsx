import { Outlet } from "react-router";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/components/adminLayout/AppSidebar";
import Backdrop from "@/components/adminLayout/Backdrop";
import AppHeader from "@/components/adminLayout/AppHeader";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import Loading from "@/pages/Loading";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await adminApi.isAdmin();
        setIsAdmin(response);
      } catch (_err) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto h-screen max-w-(--breakpoint-2xl) md:p-6 dark:bg-gray-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;
