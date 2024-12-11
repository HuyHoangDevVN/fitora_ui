import LoginForm from "@/components/Login/LoginForm";

const Login = () => {
  return (
    <div className="login-page grid grid-cols-7 gap-[20px] h-screen">
      <div className="image-contaniners col-span-4 bg-primary"></div>
      <div className="login-box h-screen col-span-3  min-h-screen flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-center max-w-md p-6 bg-white shadow-lg rounded-[20px]">
          <h1 className="text-2xl text-center font-bold my-4">Đăng nhập</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
