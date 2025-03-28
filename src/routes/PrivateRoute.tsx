import { checkLoginStatus } from "@/features/auth/authSlice";
import Loading from "@/pages/Loading";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
