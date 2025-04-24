import { authRepository } from "./repository";

export const loginUser = async (username: string, password: string) => {
  const response = await authRepository.post("/auth/login", {
    email: username,
    password,
  });
  return response;
};

export const registerUser = async (
  username: string,
  password: string,
  fullname: string
) => {
  const response = await authRepository.post("/auth/register", {
    email: username,
    password,
    fullname,
  });
  return response;
};

export const logoutUser = async () => {
  await authRepository.post("/auth/logout");
};

export const refreshAccessToken = async () => {
  await authRepository.post("/auth/refresh-token");
};

export const getUserInfo = async () => {
  const response = await authRepository.get("/auth/me");

  return response;
};
