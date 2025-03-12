import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";

const PrivateRoute = () => {
  const { isLoggedIn, checkLoginStatus } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      await checkLoginStatus();
      setLoading(false);
    };
    checkStatus();
  }, [checkLoginStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
