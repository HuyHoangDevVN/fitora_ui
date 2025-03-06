import Repository from "../helper/HttpHelper";

export const authRepository = new Repository("https://localhost:5000/api");
export const userRepository = new Repository("https://localhost:5003/api");
export const interactRepository = new Repository("https://localhost:5005/api");
