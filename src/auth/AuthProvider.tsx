import { authRepository } from "@/_base/const/Repository";
import { notification } from "antd";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    const dataSubmit = {
      email: username,
      password: password,
    };
    const response = await authRepository.post("/auth/login", dataSubmit);

    if (response.isSuccess && response.data) {
      notification.success({
        message: "Đăng nhập",
        description: "Đăng nhập thành công !",
      });
      setUser(username);
      localStorage.setItem("token", response.data.token?.accessToken);
    } else {
      setLoading(false);
      throw new Error("Tài khoản hoặc mật khẩu không chính xác !");
    }
    setLoading(false);
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    const dataSubmit = {
      email: username,
      password: password,
    };
    const response = await authRepository.post("/auth/register", dataSubmit);

    if (response.isSuccess && response.data) {
      console.log("Tài khoản đăng ký thành công:", username);
      setUser(username);
      localStorage.setItem("token", response.data.token?.accessToken);
    } else {
      setLoading(false);
      throw new Error("Tên tài khoản hoặc mật khẩu không hợp lệ !");
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
