import { useDispatch, useSelector } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import colors from "@/styles/colors";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Divider, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLock, FaUser } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { useEffect } from "react";

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
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    }
  }, [isLoggedIn, navigate, onSuccess]);

  const onFinish = async (values: { username: string; password: string }) => {
    const { username, password } = values;
    try {
      await dispatch(login({ username, password })).unwrap();
    } catch (error) {
      console.error("Tài khoản hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <Form
      name="login"
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
        icon={<FiLogIn />}
        iconPosition="end"
      >
        Đăng nhập
      </StyledButton>

      <h1 className="text-right font-[500] my-4">
        <span className="">Chưa có tài khoản ?</span>{" "}
        <a className="text-secondary" href="/register">
          Đăng ký
        </a>
      </h1>

      {/* <Divider plain style={{ margin: "0 0 20px 0", fontWeight: 500 }}>
        Hoặc
      </Divider>

      <Button
        type="default"
        icon={<FcGoogle />}
        className="font-[500] w-[300px] p-5 rounded-[20px]"
      >
        Đăng nhập bằng Google
      </Button> */}
    </Form>
  );
};

export default LoginForm;
