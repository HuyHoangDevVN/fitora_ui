import Repository from "./axiosClient";
export const API_URL = import.meta.env.VITE_API_URL;

export const authRepository = new Repository(`${API_URL}/auth`);
export const userRepository = new Repository(`${API_URL}/user`);
export const interactRepository = new Repository(`${API_URL}/interact`);
export const chatRepository = new Repository(`${API_URL}/chat`);
