import { useAuth } from "@/auth/AuthProvider";
import colors from "@/styles/colors";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Divider, Input } from "antd";
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

// Styled component for the login button
const StyledButton = styled(Button)`
  background-color: #ff4770;
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
    background-color: #ff5a85;
  }
`;

interface LoginFormProps {
  onSuccess?: () => void;
}

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
      setError("Tài khoản hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-5 my-auto w-[300px]"
      onSubmit={handleSubmit}
    >
      <Input
        size="large"
        placeholder="Tài khoản"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        prefix={<FaUser color={colors.primary} />}
        className="rounded-2xl w-72"
      />

      <Input.Password
        size="large"
        placeholder="Mật khẩu"
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        prefix={<FaLock color={colors.primary} />}
        className="rounded-2xl w-72"
      />

      {error && username && password && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <StyledButton htmlType="submit" type="primary" loading={loading}>
        Đăng nhập
      </StyledButton>
      <Divider plain style={{ margin: 0, fontWeight: 500 }}>
        Hoặc
      </Divider>
      <Button
        type="default"
        icon={<FcGoogle />}
        className="font-[500] w-[300px] p-5 rounded-[20px]"
      >
        Đăng nhập bằng google
      </Button>
    </form>
  );
};

export default LoginForm;
