import Repository from "../helper/HttpHelper";

export const authRepository = new Repository("http://localhost:5000/api");
export const userRepository = new Repository("http://localhost:5003/api");
