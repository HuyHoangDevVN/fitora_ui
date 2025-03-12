import { authRepository } from "@/_base/const/Repository";
import { notification } from "antd";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    fullname: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = useCallback(async () => {
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
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authRepository.post("/auth/login", {
        email: username,
        password,
      });
      if (response?.isSuccess) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(response?.user));
        localStorage.setItem("x-client-id", response?.user.id);
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
        });
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description: "Tài khoản hoặc mật khẩu không chính xác!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (username: string, password: string, fullname: string) => {
      setLoading(true);
      try {
        const response = await authRepository.post("/auth/register", {
          email: username,
          password,
          fullname,
        });
        if (response?.isSuccess) {
          notification.success({
            message: "Đăng ký thành công",
            description: "Bạn sẽ được đăng nhập tự động!",
          });
          await login(username, password);
        } else {
          notification.error({
            message: "Đăng ký thất bại",
            description: "Có lỗi xảy ra, vui lòng thử lại!",
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
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await authRepository.post("/auth/logout");
      setIsLoggedIn(false);
      localStorage.clear();
      notification.info({
        message: "Đăng xuất",
        description: "Bạn đã đăng xuất thành công.",
      });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      notification.error({
        message: "Đăng xuất thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
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
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
        refreshAccessToken,
        loading,
        checkLoginStatus,
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
