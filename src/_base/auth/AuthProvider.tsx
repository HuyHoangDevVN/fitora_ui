import { authRepository } from "@/_base/const/Repository";
import { notification } from "antd";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Kiểm tra trạng thái đăng nhập khi ứng dụng được tải lại
  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    setIsLoggedIn(isAuthenticated);
  }, []);

  const checkAuthentication = (): boolean => {
    const token = getToken();
    const refreshToken = Cookies.get("refreshToken");
    // Kiểm tra trạng thái đăng nhập và lưu trữ trạng thái trong localStorage
    return !!(
      token &&
      refreshToken &&
      localStorage.getItem("isLoggedIn") === "true"
    );
  };

  const handleResponse = (
    response: any,
    successMessage: string,
    errorMessage: string
  ) => {
    if (response.isSuccess && response.data) {
      notification.success({
        message: successMessage,
        description: "Chào mừng bạn đã quay trở lại!",
      });
      return true;
    } else {
      notification.error({
        message: errorMessage,
        description: "Tài khoản hoặc mật khẩu không chính xác!",
      });
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authRepository.post("/auth/login", {
        email: username,
        password,
      });
      if (
        handleResponse(response, "Đăng nhập thành công", "Đăng nhập thất bại")
      ) {
        setIsLoggedIn(true);
        storeTokens(response.data.token);
        localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái đăng nhập vào localStorage
      }
    } catch (error) {
      console.error("Đăng nhập lỗi:", error);
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
      if (handleResponse(response, "Đăng ký thành công", "Đăng ký thất bại")) {
        setIsLoggedIn(true);
        storeTokens(response.data.token);
        localStorage.setItem("isLoggedIn", "true"); // Lưu trạng thái đăng nhập vào localStorage
      }
    } catch (error) {
      console.error("Đăng ký lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  const storeTokens = (tokenData: any) => {
    // Lưu access token vào cookie với thuộc tính httpOnly, secure và sameSite
    Cookies.set("accessToken", tokenData?.accessToken || "", {
      secure: true,
      sameSite: "None",
      expires: 30, // Đặt ngày hết hạn cho access token
      httpOnly: true, // Token chỉ có thể được truy cập từ server
    });

    // Lưu refresh token vào Cookies với thuộc tính httpOnly và secure
    Cookies.set("refreshToken", tokenData?.refreshToken || "", {
      secure: true,
      sameSite: "None",
      expires: 30, // Đặt ngày hết hạn cho refresh token
      httpOnly: true, // Token chỉ có thể được truy cập từ server
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập khỏi localStorage
    notification.info({
      message: "Đăng xuất",
      description: "Đăng xuất thành công.",
    });
  };

  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) return;

    setLoading(true);
    try {
      const response = await authRepository.post("/auth/refresh-token", {
        refresh_token: refreshToken,
      });
      if (response.isSuccess && response.data) {
        storeTokens(response.data.token);
      } else {
        logout();
        notification.error({
          message: "Làm mới token thất bại",
          description: "Phiên làm việc đã hết hạn!",
        });
      }
    } catch (error) {
      console.error("Làm mới token lỗi:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Lấy access token từ cookie
  const getToken = (): string | null => {
    return Cookies.get("accessToken") || null;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
        refreshAccessToken,
        getToken,
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
