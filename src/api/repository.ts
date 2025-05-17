import Repository from "./axiosClient";

export const authRepository = new Repository("https://localhost:5000/api");
export const userRepository = new Repository("https://localhost:5003/api");
export const interactRepository = new Repository("https://localhost:5005/api");
export const chatRepository = new Repository("https://localhost:5007/api");
