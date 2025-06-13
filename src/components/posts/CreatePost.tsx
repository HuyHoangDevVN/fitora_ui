import { categoryApi } from "@/api/categoryApi";
import { API_URL, interactRepository } from "@/api/repository";
import { PrivacyPost } from "@/enums/post";
import {
  Avatar,
  Button,
  Input,
  message,
  Modal,
  Select,
  Spin,
  ColorPicker,
} from "antd";
import axios from "axios";
import _ from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { AiOutlineFileImage, AiOutlineSmile } from "react-icons/ai";
import { FaMapMarkerAlt, FaTimes, FaUserTag } from "react-icons/fa";
import clsx from "clsx";

const { TextArea } = Input;

type CreatePostModalProps = {
  trigger?: React.ReactNode;
  onPostCreated?: (newPost: any) => void;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  trigger,
  onPostCreated,
}) => {
  const profile = JSON.parse(localStorage.getItem("userInfo") ?? "{}");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyPost>(PrivacyPost.Private);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [keySearch, setKeySearch] = useState<string>("");
  const [categoriesForPost, setCategoriesForPost] = useState<any[]>([]);
  const [chosenCategory, setChosenCategory] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(true);
    categoryApi.fetchCategories(keySearch).then((categories) => {
      setCategoriesForPost(categories);
    });
  }, [keySearch]);

  const handleCategoryModalCancel = useCallback(() => {
    setIsCategoryModalOpen(false);
  }, []);

  const handlePostModalCancel = useCallback(() => {
    setIsPostModalOpen(false);
    setPreviewUrl("");
    setMediaUrl("");
    setContent("");
    setPrivacy(PrivacyPost.Private);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handlePostModalOk = useCallback(async () => {
    if (!content.trim()) {
      message.info("Bạn chưa viết gì cả!");
      return;
    }

    try {
      const data = {
        content,
        mediaUrl,
        privacy,
        categoryId: chosenCategory?.id,
      };

      const response = await interactRepository.post("/post/create-post", data);
      if (response?.isSuccess) {
        message.success("Đăng bài thành công!");
        if (onPostCreated) {
          onPostCreated(response.data);
        }
        setContent("");
        setMediaUrl("");
        setPreviewUrl("");
        setPrivacy(PrivacyPost.Private);
        setChosenCategory(null);
        setIsPostModalOpen(false);
      } else {
        throw new Error("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }, [content, mediaUrl, privacy, chosenCategory, onPostCreated]);

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
            <FaTimes size={14} />
          </button>
        </div>
      );
    }
    return null;
  };

  const CategoryModal = ({
    open,
    onCancel,
    onOk,
    categories,
    loading,
  }: {
    open: boolean;
    onCancel: () => void;
    onOk: (category: any) => void;
    categories: { id: string; name: string; color: string }[];
    loading?: boolean;
  }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
    );
    const [newCategory, setNewCategory] = useState({
      name: "",
      description: "",
      color: "#1677ff",
    });

    const handleSelectCategory = (id: string) => setSelectedCategory(id);

    const handleContinue = () => {
      if (selectedCategory === "new") {
        setStep(2);
      } else {
        const cat = categories.find((c) => c.id === selectedCategory);
        if (cat) onOk(cat);
      }
    };

    const handleCreateCategory = () => {
      onOk({ ...newCategory, id: "new" });
      setStep(1);
      setSelectedCategory(null);
      setNewCategory({ name: "", description: "", color: "#1677ff" });
    };

    const handleBack = () => {
      setStep(1);
      setSelectedCategory(null);
    };

    return (
      <Modal
        open={open}
        onCancel={() => {
          setStep(1);
          setSelectedCategory(null);
          onCancel();
        }}
        footer={null}
        title={step === 1 ? "Chọn chủ đề" : "Tạo chủ đề mới"}
      >
        {step === 1 ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Input
                placeholder="Tìm kiếm chủ đề..."
                value={keySearch}
                onChange={(e) => setKeySearch(e.target.value)}
                className="mb-2"
                allowClear
                onPressEnter={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  categoryApi.fetchCategories(value).then((categories) => {
                    setCategoriesForPost(categories);
                  });
                }}
                onBlur={() => {
                  categoryApi.fetchCategories(keySearch).then((categories) => {
                    setCategoriesForPost(categories);
                  });
                }}
              />
              {categories?.length === 0 ? (
                <div className="text-gray-400 italic">Không có chủ đề nào.</div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={clsx(
                      "px-3 py-1 rounded-full border flex items-center gap-2 transition text-black",
                      selectedCategory === cat.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-400"
                    )}
                    style={{ color: cat.color ?? "black" }}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    <span className="font-medium">{cat.name}</span>
                  </button>
                ))
              )}
              <button
                className={clsx(
                  "px-3 py-1 rounded-full border border-dashed border-gray-400 text-gray-600 hover:border-blue-400 transition"
                )}
                onClick={() => setSelectedCategory("new")}
              >
                + Tạo chủ đề mới
              </button>
            </div>
            <Button
              type="primary"
              block
              disabled={!selectedCategory}
              loading={loading}
              onClick={handleContinue}
            >
              Tiếp tục
            </Button>
          </div>
        ) : (
          <div>
            <Input
              placeholder="Tên chủ đề"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mb-2"
            />
            <Input
              placeholder="Mô tả chủ đề"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mb-2"
            />
            <div className="flex items-center gap-2 mb-4">
              <span>Màu sắc:</span>
              <ColorPicker
                value={newCategory.color}
                onChange={(color) =>
                  setNewCategory((prev) => ({
                    ...prev,
                    color:
                      typeof color === "string" ? color : color.toHexString(),
                  }))
                }
                showText
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={handleBack}>Quay lại</Button>
              <Button
                type="primary"
                onClick={handleCreateCategory}
                disabled={!newCategory.name}
                loading={loading}
              >
                Tạo chủ đề
              </Button>
            </div>
          </div>
        )}
      </Modal>
    );
  };

  return (
    <>
      {trigger ? (
        <div
          onClick={showCategoryModal}
          className="inline-block cursor-pointer"
        >
          {trigger}
        </div>
      ) : (
        <Button type="primary" onClick={showCategoryModal}>
          Tạo bài viết
        </Button>
      )}

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
              />
              <button className="text-xl text-blue-500 hover:text-blue-600">
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
          <Button
            type="primary"
            className="rounded-full w-full"
            onClick={handlePostModalOk}
            disabled={!content.trim() || uploading}
            loading={uploading}
          >
            Đăng
          </Button>
        </div>
      </Modal>

      <CategoryModal
        open={isCategoryModalOpen}
        onCancel={handleCategoryModalCancel}
        onOk={(category) => {
          setChosenCategory(category);
          setIsCategoryModalOpen(false);
        }}
        categories={categoriesForPost}
        loading={false}
      />
    </>
  );
};

export default CreatePostModal;
