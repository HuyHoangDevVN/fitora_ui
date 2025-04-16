import LayoutWOSB from "@/layouts/LayoutWithoutSideBar";
import Layout from "@/layouts/MainLayout";
import About from "@/pages/About";
import FriendRequestPage from "@/pages/FriendRequestPage";
import Home from "@/pages/Home";
import Login from "@/features/auth/Login";
import PageNotFound from "@/pages/PageNotFound";
import PersonalPage from "@/pages/PersonalPage";
import Profile from "@/pages/Profile";
import ProfileSettings from "@/pages/ProfileSetting";
import Register from "@/features/auth/Register";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Group from "@/pages/Group";
import CreateGroup from "@/features/groups/CreateGroup";
import GroupDetailPage from "@/features/groups/GroupDetailPage";

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
        ],
      },
      {
        path: "profile",
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
        path: "/personal",
        element: (
          <LayoutWOSB>
            <PersonalPage />
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
