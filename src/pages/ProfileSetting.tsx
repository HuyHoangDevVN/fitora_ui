/* eslint-disable no-debugger */
import { userRepository } from "@/_base/const/Repository";
import { ProfileUser } from "@/interfaces/ProfileUser";
import { ResponseBase } from "@/interfaces/ResponseBase";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  notification,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

const { Option } = Select;

interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Dayjs | null;
  gender: number;
  address: string;
  phoneNumber: string;
  profilePictureUrl: string;
  bio: string;
}

const initialState: Profile = {
  id: "",
  userId: "",
  firstName: "",
  lastName: "",
  birthDate: null,
  gender: 1,
  address: "",
  phoneNumber: "",
  profilePictureUrl: "",
  bio: "",
};

const ProfileSettings = () => {
  const [profile, setProfile] = useState<Profile>(initialState);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userRepository.get<ResponseBase<ProfileUser>>(
          `/user/profile`
        );
        if (response?.isSuccess && response?.data) {
          const userInfo = response?.data?.userInfo;
          setProfile({
            id: userInfo.id,
            userId: userInfo.userId,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            birthDate: userInfo.birthDate ? dayjs(userInfo.birthDate) : null, // chuyển thành Dayjs
            gender: userInfo.gender,
            address: userInfo.address,
            phoneNumber: userInfo.phoneNumber,
            profilePictureUrl: userInfo.profilePictureUrl,
            bio: userInfo.bio,
          });
        }
      } catch (error) {
        console.error("Lấy dữ liệu hồ sơ thất bại:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    field: keyof Profile,
    value: string | number | Dayjs | null
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await userRepository.put("/user/update-user", {
        ...profile,
        birthDate: profile.birthDate ? profile.birthDate.toISOString() : null,
      });
      if (response.isSuccess) {
        notification.success({ message: "Cập nhật hồ sơ thành công!" });
      } else {
        notification.error({ message: "Phản hồi không mong đợi từ máy chủ." });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        (error.request
          ? "Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối Internet của bạn."
          : "Đã xảy ra lỗi không mong đợi.");
      notification.error({ message: `Lỗi: ${errorMessage}` });
    }
  };

  return (
    <div className="flex min-h-full bg-gray-100 p-6">
      {/* Thanh bên */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <Avatar size={64} icon={<UserOutlined />} className="mb-3" />
        </div>
      </div>

      {/* Cài đặt hồ sơ */}
      <div className="flex-1 bg-white p-6 ml-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cài đặt hồ sơ</h2>
        <Form layout="vertical">
          <Form.Item label="Tên">
            <Input
              value={profile.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Họ">
            <Input
              value={profile.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Ngày sinh">
            <DatePicker
              value={profile.birthDate}
              onChange={(date) => handleChange("birthDate", date)}
            />
          </Form.Item>
          <Form.Item label="Giới tính">
            <Select
              value={profile.gender}
              onChange={(value) => handleChange("gender", value)}
            >
              <Option value={1}>Nam</Option>
              <Option value={2}>Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input
              value={profile.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            <Upload>
              <Button icon={<UploadOutlined />}>Tải tệp lên</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Tiểu sử">
            <Input.TextArea
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSettings;
