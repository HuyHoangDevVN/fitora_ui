import { categoryApi } from "@/api/categoryApi";
import { API_URL, interactRepository } from "@/api/repository";
import { PrivacyPost } from "@/enums/post";
import { Avatar, Button, Input, message, Modal, Select, Spin } from "antd";
import axios from "axios";
import React, { useCallback, useRef, useState, memo } from "react";
import { AiOutlineFileImage, AiOutlineSmile } from "react-icons/ai";
import { FaTimes, FaUserTag, FaMapMarkerAlt } from "react-icons/fa";

// Constants
const { TextArea } = Input;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_IMAGE_TYPES = /\.(jpeg|webp|jpg|png|gif)$/i;
const SUPPORTED_VIDEO_TYPES = /\.(mp4|webm|ogg)$/i;

// Utility functions
const getFileType = (url: string) => {
  if (SUPPORTED_IMAGE_TYPES.test(url)) return "image";
  if (SUPPORTED_VIDEO_TYPES.test(url)) return "video";
  return "file";
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getUserProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo") ?? "{}");
  } catch {
    return {};
  }
};

const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `File quá lớn! Vui lòng chọn file nhỏ hơn ${formatFileSize(
      MAX_FILE_SIZE
    )}.`;
  }
  return null;
};

// Types
interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  privacy: PrivacyPost;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePostModalProps {
  trigger?: React.ReactNode;
  onPostCreated?: (newPost: Post) => void;
}

interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

/**
 * Custom hook for handling file upload functionality
 * @returns Object containing upload state and functions
 */
const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      message.error(validationError);
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await axios.post(
        `${API_URL}/interact/upload/file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
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
      console.error("Upload failed:", error);
      message.error("Lỗi khi tải file lên!");
      URL.revokeObjectURL(preview);
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  }, []);

  const clearFile = useCallback(() => {
    if (previewUrl && !mediaUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setMediaUrl("");
  }, [previewUrl, mediaUrl]);
  return { uploading, previewUrl, mediaUrl, uploadFile, clearFile };
};

/**
 * CategoryModal component for selecting categories
 */
interface CategoryModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (category: Category) => void;
  categories: Category[];
  loading: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = memo(
  ({ open, onCancel, onOk, categories, loading }) => {
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
      null
    );

    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleOk = () => {
      if (selectedCategory) {
        onOk(selectedCategory);
        setSelectedCategory(null);
        setSearchText("");
      }
    };

    const handleCancel = () => {
      onCancel();
      setSelectedCategory(null);
      setSearchText("");
    };

    return (
      <Modal
        title="Chọn chủ đề"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Chọn"
        cancelText="Hủy"
        okButtonProps={{ disabled: !selectedCategory }}
        width={500}
      >
        <div className="space-y-4">
          <Input
            placeholder="Tìm kiếm chủ đề..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          {loading ? (
            <div className="flex justify-center py-8">
              <Spin tip="Đang tải..." />
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCategory?.id === category.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color || "#666" }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchText
                    ? "Không tìm thấy chủ đề phù hợp"
                    : "Chưa có chủ đề nào"}
                </div>
              )}
            </div>
          )}
        </div>{" "}
      </Modal>
    );
  }
);

CategoryModal.displayName = "CategoryModal";

/**
 * Main CreatePost modal component
 * Handles post creation with media upload and category selection
 */
const CreatePostModal: React.FC<CreatePostModalProps> = memo(
  ({ trigger, onPostCreated }) => {
    const profile = getUserProfile();
    // States
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [privacy, setPrivacy] = useState<PrivacyPost>(PrivacyPost.Private);
    const [content, setContent] = useState("");
    const [categoriesForPost, setCategoriesForPost] = useState<Category[]>([]);
    const [chosenCategory, setChosenCategory] = useState<Category | null>(null);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // File upload hook
    const { uploading, previewUrl, mediaUrl, uploadFile, clearFile } =
      useFileUpload();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Handlers
    const showCategoryModal = useCallback(async () => {
      setIsCategoryModalOpen(true);
      setLoadingCategory(true);
      try {
        const categories = await categoryApi.fetchCategories("");
        setCategoriesForPost(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        message.error("Không thể tải danh sách chủ đề");
      } finally {
        setLoadingCategory(false);
      }
    }, []);

    const handleCategoryModalCancel = useCallback(() => {
      setIsCategoryModalOpen(false);
    }, []);

    const handlePostModalCancel = useCallback(() => {
      setIsPostModalOpen(false);
      setContent("");
      setPrivacy(PrivacyPost.Private);
      setChosenCategory(null);
      clearFile();
    }, [clearFile]);

    const handleFileChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          await uploadFile(e.target.files[0]);
        }
      },
      [uploadFile]
    );
    const handleSubmit = useCallback(async () => {
      if (!content.trim() && !mediaUrl) {
        message.warning("Vui lòng nhập nội dung hoặc chọn file!");
        return;
      }

      setSubmitting(true);
      try {
        const postPayload = {
          Content: content,
          MediaUrl: mediaUrl,
          Privacy: privacy,
          categoryId: chosenCategory?.id,
        };

        const response = await interactRepository.post(
          "/post/create",
          postPayload
        );

        if (response.data?.isSuccess) {
          message.success("Đăng bài thành công!");
          handlePostModalCancel();
          onPostCreated?.(response.data.data);
        } else {
          throw new Error(response.data?.message || "Đăng bài thất bại");
        }
      } catch (error) {
        console.error("Post creation failed:", error);
        message.error("Đăng bài thất bại!");
      } finally {
        setSubmitting(false);
      }
    }, [
      content,
      mediaUrl,
      privacy,
      chosenCategory?.id,
      onPostCreated,
      handlePostModalCancel,
    ]); // Render functions
    const renderPreview = () => {
      if (uploading) {
        return (
          <div className="mt-3 flex justify-center items-center h-48 bg-gray-100 rounded-lg">
            <Spin tip="Đang tải lên..." />
          </div>
        );
      }

      if (!previewUrl) return null;

      const fileType = getFileType(previewUrl);

      return (
        <div className="mt-3 relative">
          {fileType === "image" ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full object-contain"
                style={{ maxHeight: "400px" }}
              />
            </div>
          ) : fileType === "video" ? (
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
                {previewUrl.split("/").pop() || previewUrl}
              </a>
            </div>
          )}
          <button
            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            onClick={clearFile}
          >
            <FaTimes />
          </button>
        </div>
      );
    };

    // Main render
    return (
      <>
        {trigger ? (
          <div onClick={() => setIsPostModalOpen(true)}>{trigger}</div>
        ) : (
          <div
            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setIsPostModalOpen(true)}
          >
            <Avatar src={profile?.profilePictureUrl} size={40} />
            <div className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-gray-500">
              Bạn đang nghĩ gì?
            </div>
          </div>
        )}{" "}
        {/* Main Post Modal */}
        <Modal
          open={isPostModalOpen}
          onCancel={handlePostModalCancel}
          footer={null}
          width={600}
          className="rounded-lg overflow-hidden"
          closable={false}
          styles={{ body: { padding: 0 } }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50">
            <h2 className="text-lg font-bold">Tạo bài viết</h2>
            <button
              onClick={handlePostModalCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                src={profile?.profilePictureUrl ?? "https://i.pravatar.cc/80"}
                size={40}
              />
              <div className="flex flex-col">
                <span className="font-medium text-base">
                  {profile?.lastName + " " + profile?.firstName}
                </span>
                <Select
                  value={privacy}
                  onChange={setPrivacy}
                  style={{ width: 130 }}
                  size="small"
                  variant="borderless"
                >
                  <Select.Option value={PrivacyPost.Public}>
                    Công khai
                  </Select.Option>
                  <Select.Option value={PrivacyPost.FriendsOnly}>
                    Bạn bè
                  </Select.Option>
                  <Select.Option value={PrivacyPost.Private}>
                    Chỉ mình tôi
                  </Select.Option>
                </Select>
              </div>
            </div>

            <TextArea
              className="border-none focus:ring-0 text-lg placeholder:text-gray-400"
              placeholder={`${profile?.firstName} ơi, bạn đang nghĩ gì thế?`}
              autoSize={{ minRows: 2, maxRows: 6 }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {renderPreview()}

            {chosenCategory && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-600">Chủ đề:</span>
                <span
                  className="px-2 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: chosenCategory.color || "#666" }}
                >
                  {chosenCategory.name}
                </span>
                <button
                  onClick={() => setChosenCategory(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between px-2 py-2 border rounded-lg bg-gray-50">
              <span className="text-gray-500 text-sm">
                Thêm vào bài viết của bạn
              </span>
              <div className="flex items-center gap-3">
                <button
                  className="text-xl text-green-500 hover:text-green-600"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <AiOutlineFileImage />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                <button
                  className="text-xl text-blue-500 hover:text-blue-600"
                  onClick={showCategoryModal}
                >
                  <FaUserTag />
                </button>
                <button className="text-xl text-yellow-500 hover:text-yellow-600">
                  <AiOutlineSmile />
                </button>
                <button className="text-xl text-pink-500 hover:text-pink-600">
                  <FaMapMarkerAlt />
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t bg-gray-50">
            {" "}
            <Button
              type="primary"
              className="rounded-full w-full"
              onClick={handleSubmit}
              disabled={
                (!content.trim() && !mediaUrl) || uploading || submitting
              }
              loading={submitting}
            >
              {submitting ? "Đang đăng..." : "Đăng"}
            </Button>
          </div>
        </Modal>
        {/* Category Modal */}
        <CategoryModal
          open={isCategoryModalOpen}
          onCancel={handleCategoryModalCancel}
          onOk={(category) => {
            setChosenCategory(category);
            setIsCategoryModalOpen(false);
          }}
          categories={categoriesForPost}
          loading={loadingCategory}
        />{" "}
      </>
    );
  }
);

CreatePostModal.displayName = "CreatePostModal";

export default CreatePostModal;
