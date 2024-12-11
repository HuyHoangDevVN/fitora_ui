import { useAuth } from "@/auth/AuthProvider";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

interface LoginFormProps {
  onSuccess?: () => void;
}

const StyledButton = styled(Button)`
  background-color: #ff4770; /* Màu nền mặc định */
  border-color: #ff4770;
  border-radius: 20px;
  font-weight: bold;
  width: 300px;
  padding: 1.25rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #d9365e !important;
    border-color: #d9365e;
  }

  &:focus {
    background-color: #ff5a85; /* Màu khi focus */
  }
`;
const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch {
      setError("Tài khoản hoặc mật khẩu không chính xác !");
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[20px] my-auto"
      onSubmit={handleSubmit}
    >
      <Input
        size="large"
        placeholder="Tài khoản"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        prefix={<UserOutlined />}
        className="rounded-[20px] w-[300px]"
      />
      <Input.Password
        size="large"
        placeholder="Mật khẩu"
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        prefix={<FaLock />}
        className="rounded-[20px]  w-[300px]"
      />
      {error && <p className="text-red-500">{error}</p>}
      <StyledButton htmlType="submit" type="primary" loading={loading}>
        Đăng nhập
      </StyledButton>
    </form>
  );
};

export default LoginForm;
