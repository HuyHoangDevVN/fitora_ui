import RegisterImage from "@/assets/images/register.png";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="register-page grid grid-cols-7 gap-5 h-screen">
      <div className="hidden lg:flex justify-around items-center w-full col-span-4 bg-primary px-10">
        <div className="register-story text-white max-w-md">
          <h1 className="text-5xl font-bold mb-4">Fitora</h1>
          <h2 className="text-base font-medium leading-relaxed text-white">
            Tham gia Fitora ngay hôm nay, nền tảng học tập hiện đại, nơi bạn có
            thể chia sẻ kiến thức, khám phá ý tưởng và kết nối với cộng đồng
            sinh viên năng động.
          </h2>
        </div>

        <img
          className="w-1/2 max-w-sm object-contain rounded-lg"
          src={RegisterImage}
          alt="Join Learning Community Illustration"
        />
      </div>

      <div className="col-span-7 lg:col-span-3 flex flex-col justify-center items-center h-screen">
        <div className="register-box w-full max-w-md p-6 bg-white shadow-lg rounded-lg flex flex-col items-center">
          <h1 className="text-2xl font-bold text-center mt-5">
            Đăng ký với <span className="text-primary">Fitora</span>
          </h1>
          <h2 className="text-sm font-medium text-center text-gray-600 my-2 w-[300px]">
            Tạo tài khoản mới để bắt đầu hành trình học tập thú vị cùng chúng
            tôi.
          </h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
