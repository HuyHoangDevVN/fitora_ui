import Repository from "./axiosClient";
import { API_BASE_URL } from "@/config/runtimeConfig";

export const API_URL = API_BASE_URL;

export const authRepository = new Repository(`${API_URL}/auth`);
export const userRepository = new Repository(`${API_URL}/user`);
export const interactRepository = new Repository(`${API_URL}/interact`);
export const chatRepository = new Repository(`${API_URL}/chat`);
