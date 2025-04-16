import { interactRepository } from "@/api/repository";
import { GroupPrivacy } from "@/enums/group";
import { PrivacyPost } from "@/enums/post";
import {
  createCategory,
  fetchCategoriesForPost,
  followCategory,
} from "@/features/category/categorySlice";
import { AppDispatch, RootState } from "@/store/store";
import { GroupResponse } from "@/types/group";
import {
  CalendarOutlined,
  CommentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LikeOutlined,
  MenuOutlined,
  PictureOutlined,
  ShareAltOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Drawer,
  Input,
  List,
  message,
  Modal,
  Select,
  Spin,
  Tabs,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { groupApi } from "../../api/groupApi";
import { FaLock } from "react-icons/fa";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PostCard: React.FC<{ post: any }> = ({ post }) => (
  <Card
    key={post.id}
    className="mb-4 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-shadow duration-300"
    bodyStyle={{ padding: "20px" }}
  >
    <div className="flex items-start gap-4 mb-4">
      <Avatar
        src={post.authorAvatar || "https://via.placeholder.com/40"}
        size={50}
        className="shadow-md"
      />
      <div>
        <Text className="text-lg font-bold text-gray-900">{post.author}</Text>
        <Text className="text-sm text-gray-500 block">{post.time}</Text>
      </div>
    </div>
    <Paragraph className="text-gray-800 mb-4 text-base leading-relaxed">
      {post.content}
    </Paragraph>
    <div className="flex justify-between border-t border-gray-300 pt-3">
      <Button
        type="text"
        icon={<LikeOutlined />}
        className="text-gray-600 hover:text-blue-500 font-medium"
      >
        Thích
      </Button>
      <Button
        type="text"
        icon={<CommentOutlined />}
        className="text-gray-600 hover:text-blue-500 font-medium"
      >
        Bình luận
      </Button>
      <Button
        type="text"
        icon={<ShareAltOutlined />}
        className="text-gray-600 hover:text-blue-500 font-medium"
      >
        Chia sẻ
      </Button>
    </div>
  </Card>
);

const GroupDetailPage: React.FC = () => {
  const { idGroup } = useParams();
  const { profile } = useSelector((state: RootState) => state.user);

  const [groupData, setGroupData] = useState<GroupResponse | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [posting, setPosting] = useState<boolean>(false);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [keySearch, setKeySearch] = useState<string>("");
  const { categoriesForPost } = useSelector(
    (state: any) => state.category || {}
  );
  const dispatch = useDispatch<AppDispatch>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (idGroup) {
        try {
          const response = await groupApi.getGroupById(idGroup);
          setGroupData(response ?? null);
        } catch (error) {
          console.error("Failed to fetch group data", error);
          setError("Không thể tải dữ liệu nhóm. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGroupData();
  }, [idGroup]);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const getPrivacy = (privacy: GroupPrivacy) => {
    switch (privacy) {
      case GroupPrivacy.Public:
        return "Công khai";
      case GroupPrivacy.Private:
        return "Riêng tư";
      case GroupPrivacy.Secret:
        return "Bí mật";
      default:
        return "Không xác định";
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await axios.post(
          "https://localhost:5005/api/Upload/file",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (uploadResponse.data?.url) {
          setMediaUrl(uploadResponse.data.url);
          URL.revokeObjectURL(preview);
          setPreviewUrl(uploadResponse.data.url);
          message.success("Tải file lên thành công!");
        } else {
          throw new Error("Lỗi khi tải file!");
        }
      } catch (error) {
        console.error("Lỗi khi tải file:", error);
        message.error("Lỗi khi tải file!");
        setPreviewUrl("");
        setMediaUrl("");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      message.info("Bạn chưa viết gì cả!");
      return;
    }

    setPosting(true);
    try {
      const data = {
        content: newPostContent,
        mediaUrl: mediaUrl,
        privacy: PrivacyPost.Public,
        groupId: idGroup,
      };

      const response = await interactRepository.post("/post/create-post", data);
      if (response?.isSuccess) {
        message.success("Đăng bài thành công!");
        setPosts([response.data, ...posts]);
        setNewPostContent("");
        setMediaUrl("");
        setPreviewUrl("");
      } else {
        throw new Error("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setPosting(false);
    }
  };

  const renderPreview = () => {
    if (uploading) {
      return (
        <div className="mt-3 flex justify-center items-center h-48 bg-gray-100 rounded-lg">
          <Spin tip="Đang tải lên..." />
        </div>
      );
    }

    if (previewUrl) {
      const isImage = /\.(jpeg|webp|jpg|png|gif)$/i.test(previewUrl);
      const isVideo = /\.(mp4|webm|ogg)$/i.test(previewUrl);

      return (
        <div className="mt-3 relative">
          {isImage ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full object-contain"
                style={{ maxHeight: "400px" }}
              />
            </div>
          ) : isVideo ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <video
                src={previewUrl}
                controls
                className="w-full"
                style={{ maxHeight: "400px" }}
              />
            </div>
          ) : (
            <div className="p-2 border border-gray-200 rounded-lg">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                {previewUrl}
              </a>
            </div>
          )}
          <button
            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-red-600"
            onClick={() => {
              setPreviewUrl("");
              setMediaUrl("");
              if (previewUrl && !mediaUrl) URL.revokeObjectURL(previewUrl);
            }}
          >
            X
          </button>
        </div>
      );
    }
    return null;
  };

  const showCategoryModal = () => {
    setIsCategoryModalOpen(true);
    dispatch(fetchCategoriesForPost(keySearch));
  };

  const handleCategoryModalOk = async () => {
    if (!selectedCategory && !newCategoryName.trim()) {
      message.info("Vui lòng chọn hoặc tạo một chủ đề!");
      return;
    }

    try {
      if (!selectedCategory && newCategoryName.trim()) {
        const response = await dispatch(
          createCategory({
            name: newCategoryName,
            description: description,
          }) as any
        ).unwrap();
        setSelectedCategory(response.id);
        await dispatch(followCategory(response.id) as any);
        message.success("Chủ đề đã được tạo và theo dõi!");
      }

      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo hoặc theo dõi chủ đề:", error);
      message.error("Có lỗi xảy ra khi tạo hoặc theo dõi chủ đề!");
    }
  };

  const handleCategoryModalCancel = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setNewCategoryName("");
  };

  const handleSearchCategory = (value: string) => {
    setKeySearch(value);
    dispatch(fetchCategoriesForPost(value) as any);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-gray-100 p-4 rounded-md shadow-md">
        {error}
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="text-center text-gray-500 bg-gray-100 p-4 rounded-md shadow-md">
        Group not found
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <Card
        className="w-full lg:w-1/4 bg-white shadow-lg hidden lg:block rounded-lg p-4"
        bordered={false}
      >
        <div className="text-center mb-6">
          <Avatar
            size={80}
            src={groupData.avatarUrl || "https://via.placeholder.com/80"}
            className="mx-auto mb-2"
          />
          <Title level={4} className="text-gray-900 truncate">
            {groupData.name}
          </Title>
          <Text className="text-gray-600">
            {groupData.memberCount} thành viên
          </Text>
        </div>
        <Divider />
        <ul className="space-y-3">
          <li>
            <Button
              type="link"
              icon={<InfoCircleOutlined />}
              className="w-full text-left text-gray-700 hover:text-blue-500 flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Tổng quan
            </Button>
          </li>
          <li>
            <Button
              type="link"
              icon={<UserOutlined />}
              className="w-full text-left text-gray-700 hover:text-blue-500 flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Thành viên
            </Button>
          </li>
          <li>
            <Button
              type="link"
              icon={<FileTextOutlined />}
              className="w-full text-left text-gray-700 hover:text-blue-500 flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Bài viết
            </Button>
          </li>
          <li>
            <Button
              type="link"
              icon={<CalendarOutlined />}
              className="w-full text-left text-gray-700 hover:text-blue-500 flex items-center gap-2 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Sự kiện
            </Button>
          </li>
        </ul>
        <Divider className="my-4" />
        <div className="text-center">
          <Text className="text-gray-600">
            <UserOutlined className="mr-2" /> {groupData.memberCount} thành viên
          </Text>
        </div>
      </Card>

      <Drawer
        title={groupData.name}
        placement="left"
        closable
        onClose={toggleDrawer}
        open={drawerVisible}
        className="lg:hidden"
      >
        <ul className="space-y-2">
          {["Tổng quan", "Thành viên", "Bài viết", "Sự kiện"].map((item) => (
            <li key={item}>
              <Button type="link" className="text-gray-700 hover:text-blue-500">
                {item}
              </Button>
            </li>
          ))}
        </ul>
      </Drawer>

      <div className="flex-1 flex-col items-center justify-center px-4 lg:px-8">
        <Button
          type="text"
          icon={<MenuOutlined />}
          className="lg:hidden mb-4"
          onClick={toggleDrawer}
        >
          Menu
        </Button>
        <div className="max-w-[900px] mx-auto w-full">
          <div className="bg-white rounded-lg shadow-lg mb-4 p-4">
            <div className="relative w-full h-[300px] rounded-e-md">
              <img
                src={
                  profile?.userInfo?.profileBackgroundPictureUrl ||
                  "https://fastly.picsum.photos/id/14/536/354.jpg?hmac=p8F6lcJ45rfP_j7N_J8IqhUE9-iUu1deD1BhGiLoV2Q"
                }
                alt="Ảnh bìa"
                loading="lazy"
                className="absolute inset-0 w-full max-h-[300px] object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
            </div>
            <div className="flex flex-row justify-between items-end">
              <div className="flex flex-col md:flex-row items-center gap-4 my-4">
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <Text className="text-xl font-[600] text-gray-900">
                    {groupData.name}
                  </Text>
                  <Text className="flex items-center gap-2 text-gray-600">
                    <FaLock /> {getPrivacy(groupData.privacy)} •{" "}
                    {groupData.memberCount} thành viên
                  </Text>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 ">
                <Button
                  type="primary"
                  size="middle"
                  className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto"
                >
                  Tham gia nhóm
                </Button>
                <Button
                  size="middle"
                  className="bg-gray-200 hover:bg-gray-300 w-full md:w-auto"
                >
                  Mời bạn bè
                </Button>
              </div>
            </div>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Thảo luận" key="1">
                <div className="discussion-tab">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="create-post-section lg:w-2/3">
                        <Card className="shadow-lg rounded-lg ">
                          <div className="flex items-start gap-3">
                            <Avatar
                              size={40}
                              src={profile?.userInfo?.profilePictureUrl}
                            />
                            <TextArea
                              placeholder="Bạn đang nghĩ gì..."
                              autoSize={{ minRows: 2, maxRows: 4 }}
                              className="border rounded-lg flex-1"
                              value={newPostContent}
                              onChange={(e) =>
                                setNewPostContent(e.target.value)
                              }
                            />
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-3">
                              <Button
                                icon={<PictureOutlined />}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="text-green-500 hover:text-green-600"
                              >
                                Thêm ảnh/video
                              </Button>
                              <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                              />
                              <Button
                                icon={<TagsOutlined />}
                                onClick={showCategoryModal}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                Chọn chủ đề
                              </Button>
                            </div>
                            <Button
                              type="primary"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={handleCreatePost}
                              loading={posting}
                            >
                              Đăng bài
                            </Button>
                          </div>
                          {renderPreview()}
                        </Card>
                      </div>
                      <div className="group-introduction-section lg:w-1/3">
                        <Card className="shadow-lg rounded-lg">
                          <Title level={5} className="text-gray-900 mb-2">
                            Giới thiệu nhóm
                          </Title>
                          <Text className="text-gray-600 block mb-4">
                            {groupData.description || "Nhóm này chưa có mô tả."}
                          </Text>
                          <div className="flex flex-col gap-2">
                            <Text className="text-gray-600">
                              <strong>Thành viên:</strong>{" "}
                              {groupData.memberCount}
                            </Text>
                            <Text className="text-gray-600">
                              <strong>Quyền riêng tư:</strong>{" "}
                              {getPrivacy(groupData.privacy)}
                            </Text>
                          </div>
                        </Card>
                      </div>
                    </div>
                    <div className="posts-list-section">
                      <List
                        dataSource={posts}
                        renderItem={(post) => <PostCard post={post} />}
                      />
                    </div>
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Thành viên" key="2">
                <List
                  dataSource={[
                    {
                      id: 1,
                      name: "Nguyen Van A",
                      role: "Admin",
                      avatar: "https://via.placeholder.com/40",
                    },
                    {
                      id: 2,
                      name: "Tran Thi B",
                      role: "Member",
                      avatar: "https://via.placeholder.com/40",
                    },
                    {
                      id: 3,
                      name: "Le Van C",
                      role: "Member",
                      avatar: "https://via.placeholder.com/40",
                    },
                  ]}
                  renderItem={(member) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={member.avatar} />}
                        title={member.name}
                        description={member.role}
                      />
                    </List.Item>
                  )}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal
        open={isCategoryModalOpen}
        onCancel={handleCategoryModalCancel}
        onOk={handleCategoryModalOk}
        title="Chọn hoặc tạo chủ đề"
        okText="Tiếp tục"
        cancelText="Hủy"
      >
        <Select
          showSearch
          placeholder="Tìm kiếm chủ đề"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          onSearch={handleSearchCategory}
          style={{ width: "100%" }}
          allowClear
          filterOption={false}
        >
          {categoriesForPost?.map((category: any) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
        <Input
          placeholder="Hoặc tạo chủ đề mới"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="mt-2"
        />
        <Input
          placeholder="Mô tả chủ đề mới"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2"
        />
      </Modal>
    </div>
  );
};

export default GroupDetailPage;
