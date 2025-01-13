import axios, { AxiosInstance } from "axios";
import { notification } from "antd";
import { Delay } from "./FunctionHelper";

class Repository {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    if (!baseURL) throw new Error("Base URL là bắt buộc!");

    // Tạo instance của Axios với cấu hình mặc định
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`, // Lấy token từ localStorage
      },
    });
  }

  /**
   * Lấy token từ localStorage và loại bỏ dấu ngoặc kép nếu có.
   */
  private getToken(): string {
    return localStorage.getItem("token")?.replace(/"/g, "") || "";
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
      const response = await this.axiosInstance.get<T>(url, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
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
      const response = await this.axiosInstance.post<T>(url, data, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
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
      const response = await this.axiosInstance.put<T>(url, data, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
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

    const { response } = error;
    const status = response?.status;
    const description =
      response?.data?.message || "Đã xảy ra lỗi không mong muốn!";

    // Các thông báo lỗi được ánh xạ theo mã trạng thái HTTP
    const errorMessages: Record<
      number,
      { message: string; description: string }
    > = {
      401: {
        message: "Không được phép",
        description: "Vui lòng đăng nhập lại!",
      },
      403: {
        message: "Bị từ chối",
        description: "Bạn không có quyền truy cập tài nguyên này.",
      },
      404: { message: "Không tìm thấy", description },
      500: {
        message: "Lỗi máy chủ",
        description: response?.data?.errors?.msg?.[0] || description,
      },
    };

    const notificationData = errorMessages[status] || {
      message: "Lỗi không xác định",
      description: "Đã xảy ra lỗi không mong muốn!",
    };

    notification.error(notificationData); // Hiển thị thông báo lỗi
  }
}

export default Repository;
