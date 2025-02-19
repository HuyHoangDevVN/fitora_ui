import { authRepository } from "@/_base/const/Repository";
import { notification } from "antd";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Kiểm tra trạng thái đăng nhập khi ứng dụng tải lên
  useEffect(() => {
    const storedStatus = localStorage.getItem("isLoggedIn");
    if (storedStatus === "true") {
      setIsLoggedIn(true);
    } else {
      checkLoginStatus();
    }
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await authRepository.get("/auth/me");
      if (response?.isSuccess) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      } else {
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false");
      }
    } catch (error) {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authRepository.post("/auth/login", {
        email: username,
        password,
      });
      if (response?.isSuccess) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response?.data?.responseDto?.user)
        );
        localStorage.setItem(
          "x-client-id",
          response?.data?.responseDto?.user.id
        );
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Tài khoản hoặc mật khẩu không chính xác!",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authRepository.post("/auth/register", {
        email: username,
        password,
      });
      if (response?.isSuccess) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        notification.success({
          message: "Đăng ký thành công",
          description: "Bạn có thể đăng nhập ngay bây giờ!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authRepository.post("/auth/logout");
      setIsLoggedIn(false);
      localStorage.clear();
      notification.info({
        message: "Đăng xuất",
        description: "Bạn đã đăng xuất thành công.",
      });
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      await authRepository.post("/auth/refresh-token");
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
      notification.error({
        message: "Phiên làm việc hết hạn",
        description: "Vui lòng đăng nhập lại.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
        refreshAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
