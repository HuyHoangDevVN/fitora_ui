import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

const PrivateRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const { checkLoginStatus } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
