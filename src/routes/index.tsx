import PrivateRoute from "@/_base/auth/PrivateRoute";
import LayoutWOSB from "@/layouts/LayoutWithoutSideBar";
import Layout from "@/layouts/MainLayout";
import About from "@/pages/About";
import FriendRequestPage from "@/pages/FriendRequestPage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import PageNotFound from "@/pages/PageNotFound";
import PersonalPage from "@/pages/PersonalPage";
import Profile from "@/pages/Profile";
import ProfileSettings from "@/pages/ProfileSetting";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router-dom";

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
