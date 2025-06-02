import axios, { AxiosInstance } from "axios";
import { notification } from "antd";
import Cookies from "js-cookie";
import { authApi } from "./authApi";
import { Delay } from "@/utils/delay";

class Repository {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    if (!baseURL) throw new Error("Base URL là bắt buộc!");

    // Tạo instance của Axios với cấu hình mặc định
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "x-client-id": localStorage.getItem("x-client-id"),
      },
      withCredentials: true, // Cho phép gửi cookie trong các request
    });

    // Thêm interceptor để xử lý lỗi 401 (token hết hạn)
    this.axiosInstance.interceptors.response.use(
      (response) => response, // Nếu không có lỗi, trả về response
      async (error) => {
        // Nếu lỗi là 401 thì cố gắng làm mới token
        if (error.response?.status === 401) {
          try {
            await authApi.refreshAccessToken();
            this.logout();
          } catch (err) {
            // Nếu có lỗi trong quá trình làm mới token, đăng xuất
            return Promise.reject(error);
          }
        }
        // Trả về lỗi ban đầu nếu không phải lỗi 401
        return Promise.reject(error);
      }
    );
  }

  /**
   * Gửi yêu cầu GET đến API.
   * @param url - Đường dẫn API.
   * @param options - { suppressErrorNotification?: boolean }
   */
  public async get<T = any>(
    url: string,
    options?: { suppressErrorNotification?: boolean }
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.get<T>(url);
      return response.data; // Trả về dữ liệu từ response
    } catch (error: any) {
      if (!options?.suppressErrorNotification) this.handleError(error);
    }
  }

  /**
   * Gửi yêu cầu POST đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu gửi kèm.
   * @param options - { suppressErrorNotification?: boolean }
   */
  public async post<T = any>(
    url: string,
    data?: any,
    options?: { suppressErrorNotification?: boolean }
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.post<T>(url, data);
      return response.data;
    } catch (error: any) {
      if (!options?.suppressErrorNotification) this.handleError(error);
    }
  }

  /**
   * Gửi yêu cầu PUT đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu cập nhật.
   * @param options - { suppressErrorNotification?: boolean }
   */
  public async put<T = any>(
    url: string,
    data?: any,
    options?: { suppressErrorNotification?: boolean }
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error: any) {
      if (!options?.suppressErrorNotification) this.handleError(error);
    }
  }

  /**
   * Gửi yêu cầu DELETE đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu cần xóa (nếu có).
   * @param options - { suppressErrorNotification?: boolean }
   */
  public async delete<T = any>(
    url: string,
    data?: any,
    options?: { suppressErrorNotification?: boolean }
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.delete<T>(url, data);
      return response.data;
    } catch (error: any) {
      if (!options?.suppressErrorNotification) this.handleError(error);
    }
  }

  /**
   * Gửi yêu cầu PATCH đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu cập nhật.
   * @param options - { suppressErrorNotification?: boolean }
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    options?: { suppressErrorNotification?: boolean }
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data);
      return response.data;
    } catch (error: any) {
      if (!options?.suppressErrorNotification) this.handleError(error);
    }
  }

  /**
   * Xử lý lỗi từ các yêu cầu HTTP và hiển thị thông báo.
   * @param error - Đối tượng lỗi.
   */
  private handleError(error: any): void {
    // Log chi tiết lỗi cho dev
    console.error("API Error:", error);

    let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
    if (error.code === "ERR_NETWORK") {
      errorMessage =
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
    } else if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = "Dữ liệu gửi lên không hợp lệ.";
          break;
        case 401:
          errorMessage =
            "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.";
          break;
        case 403:
          errorMessage = "Bạn không có quyền thực hiện thao tác này.";
          break;
        case 404:
          errorMessage = "Không tìm thấy tài nguyên hoặc đường dẫn.";
          break;
        case 409:
          errorMessage = "Dữ liệu bị xung đột. Vui lòng kiểm tra lại.";
          break;
        case 422:
          errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
          break;
        case 500:
          errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
          break;
        default:
          errorMessage = error.response?.data?.message || errorMessage;
          break;
      }
    }
    notification.error({
      message: "Có lỗi xảy ra",
      description: errorMessage,
      duration: 3,
    });
  }

  /**
   * Đăng xuất người dùng và xóa thông tin đăng nhập.
   */
  private logout(): void {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("isLoggedIn");
    notification.warning({
      message: "Token hết hạn",
      description: "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.",
    });
    window.location.href = "/login";
  }
}

export default Repository;
