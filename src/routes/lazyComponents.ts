import { lazy } from "react";

// Lazy load all components
export const PrivateRoute = lazy(() => import("./PrivateRoute"));

// Admin components
export const AccountManagement = lazy(
  () => import("@/features/admin/Account/AccountManagement")
);
export const CategoryManagement = lazy(
  () => import("@/features/admin/Category/CategoryManagement")
);
export const CommentManagement = lazy(
  () => import("@/features/admin/Comment/CommentManagement")
);
export const GroupManagement = lazy(
  () => import("@/features/admin/Group/GroupManagement")
);
export const PostManagement = lazy(
  () => import("@/features/admin/Post/PostManagement")
);
export const ReportManagement = lazy(
  () => import("@/features/admin/Report/ReportManagement")
);
export const RoleManagement = lazy(
  () => import("@/features/admin/Role/RoleManagement")
);

// Auth components
export const Login = lazy(() => import("@/features/auth/Login"));
export const Register = lazy(() => import("@/features/auth/Register"));

// Group components
export const CreateGroup = lazy(() => import("@/features/groups/CreateGroup"));
export const GroupDetailPage = lazy(
  () => import("@/features/groups/GroupDetailPage")
);

// Layout components
export const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
import LayoutWithoutSideBar from "@/layouts/LayoutWithoutSideBar";
export const LayoutWOSB = lazy(() =>
  import("@/layouts/LayoutWithoutSideBar").then((module) => ({
    default: module.default,
  }))
) as React.LazyExoticComponent<typeof LayoutWithoutSideBar>;
export const Layout = lazy(() => import("@/layouts/MainLayout"));

// Page components
export const About = lazy(() => import("@/pages/About"));
export const AdminDashboard = lazy(() => import("@/pages/AdminDashbroad"));
export const Explore = lazy(() => import("@/pages/Explore"));
export const FriendRequestPage = lazy(
  () => import("@/pages/FriendRequestPage")
);
export const Group = lazy(() => import("@/pages/Group"));
export const Home = lazy(() => import("@/pages/Home"));
export const PageNotFound = lazy(() => import("@/pages/PageNotFound"));
export const Profile = lazy(() => import("@/pages/Profile"));
export const ProfileSettings = lazy(() => import("@/pages/ProfileSetting"));
export const Saved = lazy(() => import("@/pages/Saved"));
export const Trending = lazy(() => import("@/pages/Trending"));
export const PostSearch = lazy(() => import("@/pages/PostSearch"));
