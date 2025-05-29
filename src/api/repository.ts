import Repository from "./axiosClient";

// Thay vì gọi từng service trực tiếp
export const authRepository = new Repository(
  "https://fitora-api.aiotlab.edu.vn/auth"
);
export const userRepository = new Repository(
  "https://fitora-api.aiotlab.edu.vn/user"
);
export const interactRepository = new Repository(
  "https://fitora-api.aiotlab.edu.vn/interact"
);
export const chatRepository = new Repository(
  "https://fitora-api.aiotlab.edu.vn/chat"
); // nếu có cấu hình route tương ứng
