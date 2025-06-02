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
import RoleManagement from "@/features/admin/Role/RoleManagement";
import CategoryManagement from "@/features/admin/Category/CategoryManagement";
import GroupManagement from "@/features/admin/Group/GroupManagement";
import PostManagement from "@/features/admin/Post/PostManagement";
import CommentManagement from "@/features/admin/Comment/CommentManagement";
import ReportManagement from "@/features/admin/Report/ReportManagement";

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
      {
        path: "role-management",
        element: <RoleManagement />,
      },
      {
        path: "category-management",
        element: <CategoryManagement />,
      },
      {
        path: "group-management",
        element: <GroupManagement />,
      },
      {
        path: "post-management",
        element: <PostManagement />,
      },
      {
        path: "comment-management",
        element: <CommentManagement />,
      },
      {
        path: "report-processing",
        element: <ReportManagement />,
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
