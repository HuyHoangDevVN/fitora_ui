import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingFallback from "@/components/common/LoadingFallback";
import {
  PrivateRoute,
  AccountManagement,
  CategoryManagement,
  CommentManagement,
  GroupManagement,
  PostManagement,
  ReportManagement,
  RoleManagement,
  Login,
  Register,
  CreateGroup,
  GroupDetailPage,
  AdminLayout,
  LayoutWOSB,
  Layout,
  About,
  AdminDashboard,
  Explore,
  FriendRequestPage,
  Group,
  Home,
  PageNotFound,
  Profile,
  ProfileSettings,
  Saved,
  Trending,
  PostSearch,
} from "./lazyComponents";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback message="Authenticating..." />}>
        <PrivateRoute />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingFallback />}>
        <PageNotFound />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingFallback message="Loading layout..." />}>
            <Layout />
          </Suspense>
        ),
        children: [
          {
            path: "/",
            element: (
              <Suspense
                fallback={<LoadingFallback message="Loading home..." />}
              >
                <Home />
              </Suspense>
            ),
          },
          {
            path: "about",
            element: (
              <Suspense
                fallback={<LoadingFallback message="Loading about..." />}
              >
                <About />
              </Suspense>
            ),
          },
          {
            path: "trending",
            element: (
              <Suspense
                fallback={<LoadingFallback message="Loading trending..." />}
              >
                <Trending />
              </Suspense>
            ),
          },
          {
            path: "saved",
            element: (
              <Suspense
                fallback={<LoadingFallback message="Loading saved posts..." />}
              >
                <Saved />
              </Suspense>
            ),
          },
          {
            path: "explore",
            element: (
              <Suspense
                fallback={<LoadingFallback message="Loading explore..." />}
              >
                <Explore />
              </Suspense>
            ),
          },
          {
            path: "search/:query",
            element: (
              <Suspense fallback={<LoadingFallback message="Searching..." />}>
                <PostSearch />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/profile/:userId",
        element: (
          <Suspense fallback={<LoadingFallback message="Loading profile..." />}>
            <LayoutWOSB>
              <Profile />
            </LayoutWOSB>
          </Suspense>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading profile settings..." />}
          >
            <LayoutWOSB>
              <ProfileSettings />
            </LayoutWOSB>
          </Suspense>
        ),
      },
      {
        path: "/friend-requests",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading friend requests..." />}
          >
            <LayoutWOSB>
              <FriendRequestPage />
            </LayoutWOSB>
          </Suspense>
        ),
      },
      {
        path: "/groups",
        element: (
          <Suspense fallback={<LoadingFallback message="Loading groups..." />}>
            <LayoutWOSB>
              <Group />
            </LayoutWOSB>
          </Suspense>
        ),
      },
      {
        path: "/groups/create",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading group creation..." />}
          >
            <LayoutWOSB>
              <CreateGroup />
            </LayoutWOSB>
          </Suspense>
        ),
      },
      {
        path: "/groups/:idGroup",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading group details..." />}
          >
            <LayoutWOSB>
              <GroupDetailPage />
            </LayoutWOSB>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingFallback message="Loading admin..." />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading dashboard..." />}
          >
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: "account-management",
        element: (
          <Suspense
            fallback={
              <LoadingFallback message="Loading account management..." />
            }
          >
            <AccountManagement />
          </Suspense>
        ),
      },
      {
        path: "role-management",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading role management..." />}
          >
            <RoleManagement />
          </Suspense>
        ),
      },
      {
        path: "category-management",
        element: (
          <Suspense
            fallback={
              <LoadingFallback message="Loading category management..." />
            }
          >
            <CategoryManagement />
          </Suspense>
        ),
      },
      {
        path: "group-management",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading group management..." />}
          >
            <GroupManagement />
          </Suspense>
        ),
      },
      {
        path: "post-management",
        element: (
          <Suspense
            fallback={<LoadingFallback message="Loading post management..." />}
          >
            <PostManagement />
          </Suspense>
        ),
      },
      {
        path: "comment-management",
        element: (
          <Suspense
            fallback={
              <LoadingFallback message="Loading comment management..." />
            }
          >
            <CommentManagement />
          </Suspense>
        ),
      },
      {
        path: "report-processing",
        element: (
          <Suspense
            fallback={
              <LoadingFallback message="Loading report processing..." />
            }
          >
            <ReportManagement />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingFallback message="Loading login..." />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingFallback message="Loading register..." />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PageNotFound />
      </Suspense>
    ),
  },
]);

export default router;
