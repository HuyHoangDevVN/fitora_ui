import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import Chat from "@/features/chat/Chat";
import CreateGroup from "@/features/groups/CreateGroup";
import GroupDetailPage from "@/features/groups/GroupDetailPage";
import LayoutWOSB from "@/layouts/LayoutWithoutSideBar";
import Layout from "@/layouts/MainLayout";
import About from "@/pages/About";
import AdminDashboard from "@/pages/AdminDashbroad";
import Explore from "@/pages/Explore";
import FriendRequestPage from "@/pages/FriendRequestPage";
import Group from "@/pages/Group";
import Home from "@/pages/Home";
import PageNotFound from "@/pages/PageNotFound";
import Profile from "@/pages/Profile";
import ProfileSettings from "@/pages/ProfileSetting";
import Saved from "@/pages/Saved";
import Trending from "@/pages/Trending";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AccountManagement from "@/features/admin/Account/AccountManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "about", element: <About /> },
          { path: "trending", element: <Trending /> },
          { path: "saved", element: <Saved /> },
          { path: "explore", element: <Explore /> },
        ],
      },
      {
        path: "/profile/:userId",
        element: (
          <LayoutWOSB>
            <Profile />
          </LayoutWOSB>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <LayoutWOSB>
            <ProfileSettings />
          </LayoutWOSB>
        ),
      },
      {
        path: "/friend-requests",
        element: (
          <LayoutWOSB>
            <FriendRequestPage />
          </LayoutWOSB>
        ),
      },
      {
        path: "/groups",
        element: (
          <LayoutWOSB>
            <Group />
          </LayoutWOSB>
        ),
      },
      {
        path: "/groups/create",
        element: (
          <LayoutWOSB>
            <CreateGroup />
          </LayoutWOSB>
        ),
      },
      {
        path: "/groups/:idGroup",
        element: (
          <LayoutWOSB>
            <GroupDetailPage />
          </LayoutWOSB>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "account-management",
        element: <AccountManagement />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
