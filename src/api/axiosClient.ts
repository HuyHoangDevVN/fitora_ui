import axios, { AxiosInstance } from "axios";
import { notification } from "antd";
import Cookies from "js-cookie";
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
            const response = await this.axiosInstance.post(
              "https://localhost:5000/api/auth/refresh-token"
            );

            if (response.data && response.data.token) {
              // Lưu token mới và gửi lại yêu cầu ban đầu
              error.config.headers["Authorization"] =
                "Bearer " + response.data.token;
              return this.axiosInstance(error.config);
            } else {
              // Nếu không có token mới, đăng xuất người dùng
              this.logout();
              return Promise.reject(error);
            }
          } catch (err) {
            // Nếu có lỗi trong quá trình làm mới token, đăng xuất
            this.logout();
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
   * @param suppressErrorNotification - Nếu true thì không hiển thị thông báo lỗi.
   */
  public async get<T = any>(
    url: string,
    suppressErrorNotification = false
  ): Promise<T | undefined> {
    await Delay(2500);
    try {
      const response = await this.axiosInstance.get<T>(url);
      return response.data; // Trả về dữ liệu từ response
    } catch (error: any) {
      if (!suppressErrorNotification) this.handleError(error);
    }
  }

  /**
   * Gửi yêu cầu POST đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu gửi kèm.
   */
  public async post<T = any>(url: string, data?: any): Promise<T | undefined> {
    await Delay(500);
    try {
      const response = await this.axiosInstance.post<T>(url, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Gửi yêu cầu PUT đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu cập nhật.
   */
  public async put<T = any>(url: string, data?: any): Promise<T | undefined> {
    await Delay(1000);
    try {
      const response = await this.axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Gửi yêu cầu DELETE đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu cần xóa (nếu có).
   */
  public async delete<T = any>(
    url: string,
    data?: any
  ): Promise<T | undefined> {
    await Delay(500);
    try {
      const response = await this.axiosInstance.delete<T>(url, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Xử lý lỗi từ các yêu cầu HTTP và hiển thị thông báo.
   * @param error - Đối tượng lỗi.
   */
  private handleError(error: any): void {
    if (error.code === "ERR_NETWORK") {
      notification.error({
        message: "Lỗi mạng",
        description: "Không thể kết nối đến máy chủ!",
      });
      return;
    }

    const status = error.response?.status;
    const errorMessage =
      {
        401: "Vui lòng đăng nhập lại!",
        403: "Bạn không có quyền truy cập tài nguyên này.",
        404: "Không tìm thấy tài nguyên!",
        500: "Lỗi máy chủ. Vui lòng thử lại sau.",
      }[status] || "Đã xảy ra lỗi không mong muốn!";

    notification.error({ message: "Lỗi", description: errorMessage });
  }

  /**
   * Đăng xuất người dùng và xóa thông tin đăng nhập.
   */
  private logout(): void {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("isLoggedIn");
    notification.error({
      message: "Token hết hạn",
      description: "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.",
    });
    window.location.href = "/login";
  }
}

export default Repository;
