// src/utils/uploadFile.ts
import axios from "axios";
import { message } from "antd";

/**
 * Hàm upload file chung cho toàn dự án.
 * @param file File cần tải lên.
 * @returns Promise trả về URL của file nếu tải lên thành công, ngược lại trả về null.
 */
export const uploadFile = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const response = await axios.post(
      "https://fitora-api.aiotlab.edu.vn/interact/Upload/file",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.data?.url) {
      message.success("Tải file lên thành công!");
      return response.data.url;
    } else {
      message.error("Lỗi khi tải file!");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi tải file:", error);
    message.error("Lỗi khi tải file!");
    return null;
  }
};
