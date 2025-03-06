import React, { useState, useRef, useCallback } from "react";
import { Modal, Button, Avatar, Select, Input, message, Spin } from "antd";
import { PrivacyPost } from "@/enums/PrivacyPost";
import axios from "axios";
import { interactRepository } from "@/_base/const/Repository";
import { AiOutlineFileImage, AiOutlineSmile } from "react-icons/ai";
import { FaUserTag, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const { TextArea } = Input;

type CreatePostModalProps = {
  trigger?: React.ReactNode;
  onPostCreated?: (newPost: any) => void;
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  trigger,
  onPostCreated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyPost>(PrivacyPost.Private);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showModal = useCallback(() => setIsModalOpen(true), []);
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setPreviewUrl("");
    setMediaUrl("");
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
    },
    []
  );

  const handleOk = useCallback(async () => {
    if (!content.trim()) {
      message.info("Bạn chưa viết gì cả!");
      return;
    }

    try {
      const data = {
        content,
        mediaUrl,
        privacy,
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
        setIsModalOpen(false);
      } else {
        throw new Error("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }, [content, mediaUrl, privacy, onPostCreated]);

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

  return (
    <>
      {trigger ? (
        <div onClick={showModal} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button type="primary" onClick={showModal}>
          Tạo bài viết
        </Button>
      )}

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="rounded-lg overflow-hidden"
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50">
          <h2 className="text-lg font-bold">Tạo bài viết</h2>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar src="https://i.pravatar.cc/80" size={40} />
            <div className="flex flex-col">
              <span className="font-medium text-base">
                Huy Hoang Nguyen The
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
                <Select.Option value={PrivacyPost.GroupOnly}>
                  Nhóm
                </Select.Option>
                <Select.Option value={PrivacyPost.Custom}>
                  Tùy chỉnh
                </Select.Option>
              </Select>
            </div>
          </div>

          <TextArea
            className="border-none focus:ring-0 text-lg placeholder:text-gray-400"
            placeholder="Huy Hoang ơi, bạn đang nghĩ gì thế?"
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
                accept="image/*,video/*"
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
            onClick={handleOk}
            disabled={!content.trim() || uploading}
            loading={uploading}
          >
            Đăng
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreatePostModal;
