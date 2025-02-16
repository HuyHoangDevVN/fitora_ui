import axios, { AxiosInstance } from "axios";
import { notification } from "antd";
import Cookies from "js-cookie";
import { Delay } from "./FunctionHelper";

class Repository {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    if (!baseURL) throw new Error("Base URL là bắt buộc!");

    // Tạo instance của Axios với cấu hình mặc định
    this.axiosInstance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Kích hoạt gửi cookie trong các request
    });

    // Thêm interceptor để xử lý lỗi 401 (token hết hạn)
    this.axiosInstance.interceptors.response.use(
      (response) => response, // Nếu không có lỗi, trả về phản hồi
      async (error) => {
        if (error.response?.status === 401) {
          // Nếu lỗi là 401 (token hết hạn), làm mới token
          const refreshToken = Cookies.get("refreshToken");
          if (refreshToken) {
            try {
              const response = await axios.post(
                "http://localhost:5000/auth/refresh",
                {
                  refresh_token: refreshToken,
                }
              );

              if (response.data && response.data.token) {
                // Lưu token mới
                Cookies.set("access_token", response.data.token);
                // Gửi lại yêu cầu ban đầu với token mới
                error.config.headers["Authorization"] =
                  "Bearer " + response.data.token;
                return this.axiosInstance(error.config); // Gửi lại yêu cầu
              } else {
                // Nếu refresh token không hợp lệ, yêu cầu người dùng đăng nhập lại
                this.logout();
                return Promise.reject(error);
              }
            } catch (err) {
              // Nếu có lỗi khi làm mới token, yêu cầu đăng nhập lại
              this.logout();
              return Promise.reject(error);
            }
          }
        }

        return Promise.reject(error); // Nếu không phải lỗi 401, trả về lỗi ban đầu
      }
    );
  }

  /**
   * Gửi yêu cầu GET đến API.
   * @param url - Đường dẫn API.
   * @param suppressErrorNotification - Có hiện thông báo lỗi hay không.
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
      if (!suppressErrorNotification) {
        this.handleError(error); // Xử lý và hiển thị thông báo lỗi
      }
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
      return response.data; // Trả về dữ liệu từ response
    } catch (error: any) {
      this.handleError(error); // Xử lý lỗi
    }
  }

  /**
   * Gửi yêu cầu PUT đến API.
   * @param url - Đường dẫn API.
   * @param data - Dữ liệu cần cập nhật.
   */
  public async put<T = any>(url: string, data?: any): Promise<T | undefined> {
    await Delay(1000);

    try {
      const response = await this.axiosInstance.put<T>(url, data);
      return response.data; // Trả về dữ liệu từ response
    } catch (error: any) {
      this.handleError(error); // Xử lý lỗi
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
    const description =
      error.response?.data?.message || "Đã xảy ra lỗi không mong muốn!";

    // Thông báo lỗi dựa trên mã trạng thái HTTP
    const errorMessages: Record<number, string> = {
      401: "Vui lòng đăng nhập lại!",
      403: "Bạn không có quyền truy cập tài nguyên này.",
      404: "Không tìm thấy tài nguyên!",
      500: "Lỗi máy chủ. Vui lòng thử lại sau.",
    };

    const message = errorMessages[status] || "Đã xảy ra lỗi không mong muốn!";
    notification.error({ message: "Lỗi", description: message });
  }

  /**
   * Đăng xuất người dùng và xóa các thông tin đăng nhập.
   */
  private logout(): void {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập khỏi localStorage
    notification.error({
      message: "Token hết hạn",
      description: "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.",
    });
    // Redirect đến trang đăng nhập
    window.location.href = "/login";
  }
}

export default Repository;
