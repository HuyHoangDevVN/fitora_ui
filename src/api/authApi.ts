import { ResponseBase } from "@/types/responseBase";
import { authRepository } from "./repository";

export const authApi = {
  loginUser: async (username: string, password: string) => {
    const response = await authRepository.post("/auth/login", {
      email: username,
      password,
    });
    if (!response) throw new Error("Failed to login");
    return response;
  },
  registerUser: async (
    username: string,
    password: string,
    fullname: string
  ) => {
    const response = await authRepository.post("/auth/register", {
      email: username,
      password,
      fullname,
    });
    if (!response) throw new Error("Failed to register");
    return response;
  },
  logoutUser: async () => {
    const response = await authRepository.post("/auth/logout");
    if (!response) throw new Error("Failed to logout");
    return response;
  },
  refreshAccessToken: async () => {
    const response = await authRepository.post<ResponseBase<any>>(
      "/auth/refresh-token"
    );
    return response;
  },
  getUserInfo: async () => {
    const response = await authRepository.get<any>("/auth/me");
    if (!response) throw new Error("Failed to get user info");
    return response;
  },
};
