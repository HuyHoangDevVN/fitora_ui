import { useDispatch, useSelector } from "react-redux";
import { register } from "@/features/auth/authSlice";
import { RootState, AppDispatch } from "@/store/store";
import colors from "@/styles/colors";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Form, Input, notification } from "antd";
import { FaIdCardAlt, FaLock, FaUser } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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

const FORM_WIDTH = "300px";
const INPUT_WIDTH = "w-72";

const formRules = {
  fullName: [{ required: true, message: "Vui lòng nhập họ và tên!" }],
  username: [{ required: true, message: "Vui lòng nhập tài khoản!" }],
  password: [{ required: true, message: "Vui lòng nhập mật khẩu!" }],
};

const handleRegister = async (
  dispatch: AppDispatch,
  values: { username: string; password: string; fullname: string },
  navigate: (path: string) => void,
  onSuccess?: () => void
) => {
  const { username, password, fullname } = values;
  try {
    await dispatch(register({ username, password, fullname })).unwrap();
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/login");
    }
  } catch (error) {
    notification.error({
      message: "Đăng ký thất bại",
      description: "Có lỗi xảy ra, vui lòng thử lại!",
    });
  }
};

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();

  const onFinish = (values: {
    username: string;
    password: string;
    fullname: string;
  }) => {
    handleRegister(dispatch, values, navigate, onSuccess);
  };

  return (
    <Form
      form={form}
      name="register"
      layout="vertical"
      onFinish={onFinish}
      className="flex flex-col justify-center items-center my-auto"
      style={{ width: FORM_WIDTH }}
    >
      <Form.Item name="fullname" rules={formRules.fullName}>
        <Input
          size="large"
          placeholder="Họ và tên"
          prefix={<FaIdCardAlt color={colors.primary} />}
          className={`rounded-2xl ${INPUT_WIDTH}`}
        />
      </Form.Item>

      <Form.Item name="username" rules={formRules.username}>
        <Input
          size="large"
          placeholder="Tài khoản"
          prefix={<FaUser color={colors.primary} />}
          className={`rounded-2xl ${INPUT_WIDTH}`}
        />
      </Form.Item>

      <Form.Item name="password" rules={formRules.password}>
        <Input.Password
          size="large"
          placeholder="Mật khẩu"
          prefix={<FaLock color={colors.primary} />}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          className={`rounded-2xl ${INPUT_WIDTH}`}
        />
      </Form.Item>

      <Form.Item>
        <StyledButton
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<FiUserPlus />}
          iconPosition="end"
        >
          Đăng ký
        </StyledButton>
      </Form.Item>

      <div className="text-center font-medium my-4">
        Đã có tài khoản?{" "}
        <a href="/login" className="text-secondary">
          Đăng nhập
        </a>
      </div>
    </Form>
  );
};

export default RegisterForm;
