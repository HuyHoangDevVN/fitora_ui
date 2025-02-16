import { useAuth } from "@/_base/auth/AuthProvider";
import colors from "@/styles/colors";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";

const StyledButton = styled(Button)`
  background-color: ${colors.primary};
  border-radius: 20px;
  font-weight: bold;
  width: 300px;
  padding: 1.25rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #d9365e !important;
  }

  &:focus {
    background-color: #4cc389;
  }
`;

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    const { username, password } = values;
    try {
      await register(username, password);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch {
      console.error("Đăng ký không thành công, vui lòng thử lại!");
    }
  };

  return (
    <Form
      name="register"
      className="flex flex-col justify-center items-center my-auto w-[300px]"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
      >
        <Input
          size="large"
          placeholder="Tài khoản"
          prefix={<FaUser color={colors.primary} />}
          className="rounded-2xl w-72"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password
          size="large"
          placeholder="Mật khẩu"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          prefix={<FaLock color={colors.primary} />}
          className="rounded-2xl w-72"
        />
      </Form.Item>

      <StyledButton
        htmlType="submit"
        type="primary"
        loading={loading}
        icon={<FiUserPlus />}
        iconPosition="end"
      >
        Đăng ký
      </StyledButton>

      <h1 className="text-right font-[500] my-4">
        <span className="">Đã có tài khoản?</span>{" "}
        <a className="text-secondary" href="/login">
          Đăng nhập
        </a>
      </h1>
    </Form>
  );
};

export default RegisterForm;
