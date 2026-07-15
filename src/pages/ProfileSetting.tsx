import { userRepository } from "@/api/repository";
import { ProfileUser, UserInfo } from "@/types/profileUser";
import { ResponseBase } from "@/types/responseBase";
import { uploadFile } from "@/utils/UploadFiles";
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
  profileBackgroundPictureUrl: string;
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
  profileBackgroundPictureUrl: "",
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
          const userInfo = response.data.userInfo;
          setProfile({
            id: userInfo.id,
            userId: userInfo.userId,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            birthDate: userInfo.birthDate ? dayjs(userInfo.birthDate) : null,
            gender: userInfo.gender,
            address: userInfo.address,
            phoneNumber: userInfo.phoneNumber,
            profilePictureUrl: userInfo.profilePictureUrl,
            profileBackgroundPictureUrl: userInfo.profileBackgroundPictureUrl,
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

  const handleFileChange = async (field: keyof UserInfo, file: File) => {
    const url = await uploadFile(file);
    if (url) {
      setProfile((prev) => ({
        ...prev,
        [field]: url,
      }));
    }
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
        // notification.error({ message: "Phản hồi không mong đợi từ máy chủ." });
        console.error({ message: "Phản hồi không mong đợi từ máy chủ." });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        (error.request
          ? "Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối Internet của bạn."
          : "Đã xảy ra lỗi không mong đợi.");
      // notification.error({ message: `Lỗi: ${errorMessage}` });
      console.error({ message: `Lỗi: ${errorMessage}` });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto p-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          {/* Ảnh đại diện */}
          <Avatar
            size={100}
            src={profile.profilePictureUrl || undefined}
            icon={<UserOutlined />}
            className="mb-4"
          />
          {/* Tên người dùng */}
          <h2 className="text-xl font-bold mb-1 text-center">
            {profile.firstName || profile.lastName
              ? `${profile.firstName} ${profile.lastName}`.trim()
              : "Người dùng"}
          </h2>
          {/* Các nút chức năng (ví dụ) */}
          <div className="w-full mt-4 space-y-2">
            <Button type="default" block>
              Thông tin cá nhân
            </Button>
            <Button type="default" block>
              Cài đặt tài khoản
            </Button>
          </div>
        </div>

        {/* Form cài đặt hồ sơ */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Cài đặt hồ sơ</h2>
            <p className="text-gray-500">
              Quản lý và chỉnh sửa thông tin hồ sơ cá nhân của bạn
            </p>
          </div>

          <Form layout="vertical">
            {/* Họ và Tên */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Tên" className="mb-2">
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Họ" className="mb-2">
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              </Form.Item>
            </div>

            {/* Ngày sinh và Giới tính */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Ngày sinh" className="mb-2">
                <DatePicker
                  value={profile.birthDate}
                  onChange={(date) => handleChange("birthDate", date)}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item label="Giới tính" className="mb-2">
                <Select
                  value={profile.gender}
                  onChange={(value) => handleChange("gender", value)}
                >
                  <Option value={1}>Nam</Option>
                  <Option value={2}>Nữ</Option>
                  <Option value={3}>Khác</Option>
                  <Option value={4}>Không rõ</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Địa chỉ và Số điện thoại */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Địa chỉ" className="mb-2">
                <Input
                  value={profile.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Số điện thoại" className="mb-2">
                <Input
                  value={profile.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              </Form.Item>
            </div>

            {/* Tiểu sử */}
            <Form.Item label="Tiểu sử" className="mt-4">
              <Input.TextArea
                rows={4}
                value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
              />
            </Form.Item>

            {/* Ảnh đại diện và Ảnh background */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Form.Item label="Ảnh đại diện" className="mb-2">
                <Upload
                  beforeUpload={(file) => {
                    handleFileChange("profilePictureUrl", file);
                    return false; // Ngăn upload tự động
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Ảnh background" className="mb-2">
                <Upload
                  beforeUpload={(file) => {
                    handleFileChange("profileBackgroundPictureUrl", file);
                    return false; // Ngăn upload tự động
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>
            </div>

            {/* Nút lưu */}
            <Form.Item className="mt-6">
              <Button type="primary" onClick={handleSave} block>
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
