import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAuth } from "@/auth/AuthProvider";

interface LoginFormProps {
  onSuccess?: () => void; // Callback khi đăng nhập thành công
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
        navigate("/"); // Điều hướng mặc định nếu không có callback
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Input
          type="text"
          placeholder="Tài khoản"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <Input.Password
          placeholder="Mật khẩu"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button
        htmlType="submit"
        type="primary"
        loading={loading}
        iconPosition="end"
      >
        Đăng nhập
      </Button>
    </form>
  );
};

export default LoginForm;
