import LoginForm from "@/components/Login/LoginForm";
import LoginImage from "@/assets/images/login.png";

const Login = () => {
  return (
    <div className="login-page grid grid-cols-7 gap-5 h-screen">
      <div className="hidden lg:flex justify-around items-center w-full col-span-4 bg-primary px-10">
        <div className="login-story text-white max-w-md">
          <h1 className="text-5xl font-bold mb-4">Fitora</h1>
          <h2 className="text-base font-medium leading-relaxed text-white">
            Fitora là một mạng xã hội học tập hiện đại, nơi sinh viên có thể
            chia sẻ kiến thức, thảo luận bài tập và kết nối với cộng đồng học
            tập năng động của mình.
          </h2>
        </div>

        <img
          className="w-1/2 max-w-sm object-contain rounded-lg"
          src={LoginImage}
          alt="Learning Community Illustration"
        />
      </div>

      <div className="col-span-7 lg:col-span-3 flex flex-col justify-center items-center h-screen">
        <div className="login-box w-full max-w-md p-6 bg-white shadow-lg rounded-lg flex flex-col items-center">
          <h1 className="text-2xl font-bold text-center mt-5">
            Đăng nhập vào <span className="text-primary">Fitora</span>
          </h1>
          <h2 className="text-sm font-medium text-center text-gray-600 my-2 w-[300px]">
            Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản để tiếp tục.
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
