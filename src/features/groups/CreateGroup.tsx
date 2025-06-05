import { groupApi } from "@/api/groupApi";
import { userApi } from "@/api/userApi";
import { GroupPrivacy } from "@/enums/group";
import { uploadFile } from "@/utils/UploadFiles";
import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  Input,
  notification,
  Select,
  Spin,
  Typography,
  Upload,
} from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;
const { Title, Text } = Typography;

const UserProfile = ({ profile }) => (
  <div className="flex items-center mt-4 gap-4 pb-4 pr-4 rounded-lg shadow-sm">
    <Avatar
      src={profile?.profilePictureUrl || "https://via.placeholder.com/42"}
      size={48}
      className="border border-gray-300"
    />
    <div className="flex flex-col">
      <Text className="font-bold text-gray-800 text-lg">
        {profile?.lastName + " " + profile?.firstName || "Tên người dùng"}
      </Text>
      <Text className="text-gray-500 text-sm">Quản trị viên</Text>
    </div>
  </div>
);

const GroupForm = ({
  groupName,
  setGroupName,
  privacy,
  setPrivacy,
  searchTerm,
  handleSearchChange,
  searchResults,
  loadingSearch,
  setInviteFriends,
  coverImage,
  setCoverImage,
  avatarImage,
  setAvatarImage,
  handleUpload,
}) => (
  <>
    <div className="mb-6">
      <label className="block text-gray-600 font-medium mb-2">Tên nhóm</label>
      <Input
        placeholder="Nhập tên nhóm"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="rounded-md"
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-600 font-medium mb-2">
        Chọn quyền riêng tư
      </label>
      <Select
        value={privacy}
        onChange={(value) => setPrivacy(value)}
        className="w-full rounded-md"
      >
        <Option value={GroupPrivacy.Public}>Công khai</Option>
        <Option value={GroupPrivacy.Private}>Riêng tư</Option>
      </Select>
    </div>

    <div className="mb-6">
      <label className="block text-gray-600 font-medium mb-2">
        Mời bạn bè (không bắt buộc)
      </label>
      <Input
        placeholder="Tìm kiếm bạn bè"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="rounded-md mb-4"
      />
      {loadingSearch ? (
        <Spin />
      ) : (
        <div>
          {searchResults?.map((friend) => (
            <div key={friend?.id} className="flex items-center gap-2 mb-3">
              <Checkbox
                onChange={(e) => {
                  const checked = e.target.checked;
                  setInviteFriends((prev) =>
                    checked
                      ? [...prev, friend?.id]
                      : prev.filter((id) => id !== friend?.id)
                  );
                }}
              ></Checkbox>
              <Avatar
                src={
                  friend?.profilePictureUrl || "https://via.placeholder.com/40"
                }
              />
              <Typography> {friend?.username}</Typography>
            </div>
          ))}
          {searchResults.length === 0 && !loadingSearch && (
            <Text className="text-gray-500">Không tìm thấy bạn bè</Text>
          )}
        </div>
      )}
    </div>

    <div className="mb-6">
      <label className="block text-gray-600 font-medium mb-2">
        Ảnh bìa nhóm
      </label>
      <Upload
        beforeUpload={(file) => {
          handleUpload(file, setCoverImage);
          return false;
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Tải lên ảnh bìa</Button>
      </Upload>
      {coverImage && (
        <Text className="block text-gray-500 mt-2">Đã tải lên ảnh bìa</Text>
      )}
    </div>

    <div className="mb-6">
      <label className="block text-gray-600 font-medium mb-2">
        Ảnh đại diện nhóm
      </label>
      <Upload
        beforeUpload={(file) => {
          handleUpload(file, setAvatarImage);
          return false;
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
      </Upload>
      {avatarImage && (
        <Text className="block text-gray-500 mt-2">
          Đã tải lên ảnh đại diện
        </Text>
      )}
    </div>
  </>
);

const GroupPreview = ({
  groupName,
  privacy,
  coverImage,
  avatarImage,
  inviteFriends,
}) => (
  <div className="w-2/3 bg-gray-50 p-6">
    <Title level={4} className="text-gray-800 mb-4">
      Xem trước nhóm
    </Title>
    <div className="bg-white p-4 rounded-lg shadow-md">
      {coverImage ? (
        <div className="mb-4">
          <img
            src={coverImage}
            alt="Ảnh bìa"
            loading="lazy"
            className="w-full h-48 object-cover rounded-b-md"
          />
        </div>
      ) : (
        <div className="mb-4 bg-gray-200 w-full h-48 flex items-center justify-center rounded-b-md">
          <Text className="text-gray-500">Chưa có ảnh bìa</Text>
        </div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <Avatar
          size={64}
          src={avatarImage || "https://via.placeholder.com/64"}
        />
        <div>
          <Text className="text-lg font-semibold text-gray-800">
            {groupName || "Tên nhóm của bạn"}
          </Text>
          <Text className="block text-gray-500">
            {privacy === GroupPrivacy.Public
              ? "Nhóm công khai"
              : "Nhóm riêng tư"}
          </Text>
        </div>
      </div>
      <div>
        <Text className="text-gray-600">Thành viên:</Text>
        <div className="flex items-center gap-2 mt-2">
          {inviteFriends.map((friend, index) => (
            <Avatar
              key={index}
              src="https://via.placeholder.com/40"
              alt={friend}
            />
          ))}
          {inviteFriends.length === 0 && (
            <Text className="text-gray-500">Chưa có thành viên nào</Text>
          )}
        </div>
      </div>
    </div>
  </div>
);

const CreateGroup = () => {
  const profile = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const [groupName, setGroupName] = useState("Tên nhóm của bạn");
  const [privacy, setPrivacy] = useState<GroupPrivacy>(GroupPrivacy.Public);
  const [inviteFriends, setInviteFriends] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      notification.warning({ message: "Tên nhóm không được để trống" });
      return;
    }

    const formBody = {
      Name: groupName,
      Description: "Mô tả nhóm của bạn",
      Privacy: privacy,
      RequirePostApproval: false,
      CoverImageUrl: coverImage,
      AvatarUrl: avatarImage,
    };

    try {
      const response = await groupApi.createGroup(formBody);
      if (response.isSuccess) {
        notification.success({ message: "Nhóm đã được tạo thành công!" });

        if (inviteFriends.length > 0) {
          try {
            await groupApi.inviteNewMembers({
              GroupId: response.data.id,
              ReceiverUserIds: inviteFriends,
            });
            notification.success({ message: "Đã gửi lời mời đến bạn bè!" });
          } catch (inviteError) {
            // notification.error({
            //   message: `Lỗi khi gửi lời mời: ${inviteError}`,
            // });
            console.error({
              message: `Lỗi khi gửi lời mời: ${inviteError}`,
            });
          }
        }

        resetForm();
      } else {
        // notification.error({
        //   message: `Lỗi khi tạo nhóm: ${response.message}`,
        // });
        console.error({
          message: `Lỗi khi tạo nhóm: ${response.message}`,
        });
      }
    } catch (err) {
      // notification.error({ message: `Lỗi khi tạo nhóm: ${err}` });
      console.error({ message: `Lỗi khi tạo nhóm: ${err}` });
    }
  };

  const resetForm = () => {
    setGroupName("Tên nhóm của bạn");
    setPrivacy(GroupPrivacy.Public);
    setInviteFriends([]);
    setCoverImage(null);
    setAvatarImage(null);
  };

  const handleUpload = async (
    file: File,
    setImage: (url: string | null) => void
  ) => {
    const url = await uploadFile(file);
    if (url) {
      setImage(url);
    }
  };

  const fetchFriends = async (keyword: string) => {
    setLoadingSearch(true);
    try {
      const response = await userApi.getListFriends({
        pageIndex: 0,
        pageSize: 10,
        keySearch: keyword,
      });
      setSearchResults(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bạn bè:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchFriends(searchTerm.trim());
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/3 bg-white p-6 shadow-md">
        <Title level={4} className="text-gray-800 mb-4">
          Tạo nhóm mới
        </Title>

        <UserProfile profile={profile} />

        <GroupForm
          groupName={groupName}
          setGroupName={setGroupName}
          privacy={privacy}
          setPrivacy={setPrivacy}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          searchResults={searchResults}
          loadingSearch={loadingSearch}
          setInviteFriends={setInviteFriends}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          avatarImage={avatarImage}
          setAvatarImage={setAvatarImage}
          handleUpload={handleUpload}
        />

        <Button
          type="primary"
          className="w-full bg-primary hover:bg-blue-600 text-white font-medium rounded-md"
          onClick={handleCreateGroup}
        >
          Tạo nhóm
        </Button>
      </div>

      <GroupPreview
        groupName={groupName}
        privacy={privacy}
        coverImage={coverImage}
        avatarImage={avatarImage}
        inviteFriends={inviteFriends}
      />
    </div>
  );
};

export default CreateGroup;
