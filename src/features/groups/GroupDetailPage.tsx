import { postApi } from "@/api/postApi";
import { API_URL, interactRepository } from "@/api/repository";
import PostBox from "@/components/posts/PostBox";
import { GroupPrivacy, GroupRole } from "@/enums/group";
import { PrivacyPost } from "@/enums/post";

import { AppDispatch } from "@/store/store";
import colors from "@/styles/colors";
import { GroupResponse, MemberResponse } from "@/types/group";
import {
  CalendarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  PictureOutlined,
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
import { FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { categoryApi } from "../../api/categoryApi";
import { groupApi, UpdateGroupRequest } from "../../api/groupApi";
import InviteMembersModal from "./InviteMembersModal";

const { Title, Text } = Typography;
const { TextArea } = Input;

const GroupDetailPage: React.FC = () => {
  const { idGroup } = useParams();
  const profile = JSON.parse(localStorage.getItem("userInfo") ?? "{}");

  const [member, setMember] = useState<MemberResponse | null>();
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

  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [inviteModalVisible, setInviteModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (idGroup) {
        try {
          const response = await groupApi.getGroupById(idGroup);
          setGroupData(response?.group ?? null);
          setMember(response?.groupMember ?? null);
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

  const fetchPostsByGroupId = async (groupId: string) => {
    try {
      const response = await postApi.fetchPosts({
        groupId,
        feedType: 1, // Fetch all posts for the group
      });
      if (response?.isSuccess) {
        setPosts(response.data.data);
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts by groupId:", error);
      message.error("Có lỗi xảy ra khi tải bài viết!");
    }
  };

  useEffect(() => {
    if (idGroup) {
      fetchPostsByGroupId(idGroup);
    }
  }, [idGroup]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (idGroup) {
        try {
          const response = await groupApi.getGroupMembers(idGroup, 0, 20);
          setMembers(response.data);
        } catch (error) {
          console.error("Failed to fetch group members", error);
        } finally {
          setLoadingMembers(false);
        }
      }
    };

    fetchGroupMembers();
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
          `${API_URL}/interact/upload/file`,
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
        groupId: idGroup || "",
        categoryId: selectedCategory,
      };

      const response = await interactRepository.post("/post/create-post", data);
      if (response?.isSuccess) {
        message.success("Đăng bài thành công!");
        setPosts([response.data, ...posts]);
        setNewPostContent("");
        setMediaUrl("");
        setPreviewUrl("");

        try {
          await groupApi.createGroupPost({
            postId: response.data.id,
            groupId: idGroup || "",
            authorId: profile.userId || "",
            isApproved: true,
          });
        } catch (error) {
          console.error("Lỗi khi gọi API createGroupPost:", error);
        }
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

  const showCategoryModal = async () => {
    setIsCategoryModalOpen(true);
    try {
      const categories = await categoryApi.fetchCategories(keySearch);
      // Assuming categoriesForPost is set from the fetched categories
      dispatch({ type: "SET_CATEGORIES_FOR_POST", payload: categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Có lỗi xảy ra khi tải danh mục!");
    }
  };

  const handleCategoryModalOk = async () => {
    if (!selectedCategory && !newCategoryName.trim()) {
      message.info("Vui lòng chọn hoặc tạo một chủ đề!");
      return;
    }

    try {
      if (!selectedCategory && newCategoryName.trim()) {
        const newCategory = await categoryApi.createCategory({
          name: newCategoryName,
          description: description,
        });
        setSelectedCategory(newCategory.id);
        await categoryApi.followCategory(newCategory.id);
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

  const handleSearchCategory = async (value: string) => {
    setKeySearch(value);
    try {
      const categories = await categoryApi.fetchCategories(value);
      // Assuming categoriesForPost is set from the fetched categories
      dispatch({ type: "SET_CATEGORIES_FOR_POST", payload: categories });
    } catch (error) {
      console.error("Error searching categories:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm danh mục!");
    }
  };

  const handleAssignRole = async (memberId: string, role: number) => {
    try {
      const response = await groupApi.assignRoleMember({
        assignedBy: profile.userId || "",
        groupId: idGroup || "",
        memberId,
        role,
      });
      if (response?.isSuccess) {
        message.success("Phân quyền thành công!");
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberId ? { ...member, role } : member
          )
        );
      } else {
        throw new Error(response?.message || "Phân quyền thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi phân quyền:", error);
      message.error("Phân quyền thất bại. Vui lòng thử lại.");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const response = await groupApi.deleteGroup(memberId);
      if (response?.isSuccess) {
        message.success("Xóa thành viên thành công!");
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId)
        );
      } else {
        throw new Error(response?.message || "Xóa thành viên thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xóa thành viên:", error);
      message.error("Xóa thành viên thất bại. Vui lòng thử lại.");
    }
  };

  const handleEditGroup = async (updatedGroupData: UpdateGroupRequest) => {
    try {
      const response = await groupApi.updateGroup(updatedGroupData);
      if (response?.isSuccess) {
        message.success("Cập nhật nhóm thành công!");
        setGroupData((prevGroupData) => {
          if (!prevGroupData) return null;
          return {
            ...prevGroupData,
            ...updatedGroupData,
            id: updatedGroupData.Id || prevGroupData.id, // Ensure 'id' is always defined
          };
        });
      } else {
        throw new Error(response?.message || "Cập nhật nhóm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật nhóm:", error);
      message.error("Cập nhật nhóm thất bại. Vui lòng thử lại.");
    }
  };

  const renderMemberRole = (role: number | null) => {
    switch (role) {
      case GroupRole.Owner:
        return "Chủ Nhóm";
      case GroupRole.Admin:
        return "Quản Trị Viên";
      case GroupRole.Moderator:
        return "Điều Hành Viên";
      default:
        return "Thành Viên";
    }
  };

  const renderMemberActions = (member: MemberResponse) => {
    if (member.role === GroupRole.Owner) {
      return null;
    }

    return (
      <div className="flex gap-2 mt-2">
        {member.role !== GroupRole.Admin && (
          <Button
            size="small"
            onClick={() => handleAssignRole(member.id, GroupRole.Admin)}
          >
            Phân quyền Admin
          </Button>
        )}

        <Button
          size="small"
          danger
          onClick={() => handleDeleteMember(member.id)}
        >
          Xóa khỏi nhóm
        </Button>
      </div>
    );
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
        Nhóm không tồn tại
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="relative w-full h-[300px]">
          <img
            src={groupData?.coverImageUrl || "https://via.placeholder.com/300"}
            alt="Group Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        </div>
        <div className="text-center mt-4">
          <Avatar
            size={100}
            src={groupData?.avatarUrl || "https://via.placeholder.com/100"}
            className="mx-auto mb-2 border-4 border-white"
          />
          <Title level={3} className="text-gray-900 truncate">
            {groupData?.name}
          </Title>
          <Text className="text-gray-600 block mb-4">
            {groupData?.description || "Nhóm này chưa có mô tả."}
          </Text>
          <Button
            type="primary"
            size="large"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Tham gia nhóm
          </Button>
        </div>
        <div className="mt-6 w-full max-w-4xl px-4">
          <Card className="shadow-lg rounded-lg">
            <Title level={4} className="text-gray-900 mb-2">
              Giới thiệu nhóm
            </Title>
            <Text className="text-gray-600 block mb-4">
              {groupData?.description || "Nhóm này chưa có mô tả."}
            </Text>
            <div className="flex flex-col gap-2">
              <Text className="text-gray-600">
                <strong>Thành viên:</strong> {groupData?.memberCount}
              </Text>
              <Text className="text-gray-600">
                <strong>Quyền riêng tư:</strong>{" "}
                {getPrivacy(groupData?.privacy ?? GroupPrivacy.Public)}
              </Text>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (loadingMembers) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <Card
        className="w-full lg:w-1/4 bg-white shadow-lg hidden lg:block rounded-lg p-4"
        bordered={false}
      >
        <div className="text-center mb-2">
          <Avatar
            size={80}
            src={groupData?.avatarUrl || "https://via.placeholder.com/80"}
            className="mx-auto mb-2"
          />
          <Title level={4} className="text-gray-900 truncate">
            {groupData?.name}
          </Title>
        </div>
        <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
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
      </Card>

      <Drawer
        title={groupData?.name}
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
                  profile.profileBackgroundPictureUrl ||
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
                    {groupData?.name}
                  </Text>
                  <Text className="flex items-center gap-2 text-gray-600">
                    <FaLock />{" "}
                    {getPrivacy(groupData?.privacy ?? GroupPrivacy.Public)} •{" "}
                    {groupData?.memberCount} thành viên
                  </Text>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 ">
                <Button
                  type="primary"
                  size="middle"
                  className="bg-primary hover:bg-gray-300 w-full md:w-auto"
                  onClick={() => setInviteModalVisible(true)}
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
                            <Avatar size={40} src={profile.profilePictureUrl} />
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
                            {groupData?.description ||
                              "Nhóm này chưa có mô tả."}
                          </Text>
                          <div className="flex flex-col gap-2">
                            <Text className="text-gray-600">
                              <strong>Thành viên:</strong>{" "}
                              {groupData?.memberCount}
                            </Text>
                            <Text className="text-gray-600">
                              <strong>Quyền riêng tư:</strong>{" "}
                              {getPrivacy(
                                groupData?.privacy ?? GroupPrivacy.Public
                              )}
                            </Text>
                          </div>
                        </Card>
                      </div>
                    </div>
                    <div className="posts-list-section lg:w-2/3 p-2">
                      <List
                        dataSource={posts}
                        renderItem={(post) => <PostBox post={post} />}
                      />
                    </div>
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Thành Viên" key="2">
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={members}
                  renderItem={(memberItem) => (
                    <List.Item>
                      <Card hoverable className="shadow-md rounded-lg">
                        <Card.Meta
                          avatar={
                            <Avatar
                              src={memberItem.profilePictureUrl}
                              size={50}
                              className="border border-gray-300"
                            />
                          }
                          title={
                            <span className="font-semibold text-gray-800">
                              {memberItem.userName || "Không Xác Định"}
                            </span>
                          }
                          description={
                            <div className="text-gray-600">
                              <p className="mb-1">
                                {memberItem.bio || "Chưa Có Thông Tin"}
                              </p>
                              <p className="text-sm font-medium">
                                {renderMemberRole(memberItem.role ?? null)}
                              </p>
                              {(member.role == GroupRole.Owner ||
                                member.role == GroupRole.Admin) &&
                                renderMemberActions(memberItem)}
                            </div>
                          }
                        />
                      </Card>
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
      <InviteMembersModal
        groupId={idGroup || ""}
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
      />
    </div>
  );
};

export default GroupDetailPage;
