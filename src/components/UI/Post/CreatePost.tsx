import React, { useState, useRef } from "react";
import { Modal, Button, Avatar, Select, Input, message } from "antd";
import { PrivacyPost } from "@/enums/PrivacyPost";
import axios from "axios";
import { interactRepository } from "@/_base/const/Repository";

// Icon ví dụ
import { AiOutlineFileImage, AiOutlineSmile } from "react-icons/ai";
import { FaUserTag, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const { TextArea } = Input;

type CreatePostModalProps = {
  trigger?: React.ReactNode;
  onPostCreated?: (newPost: any) => void; // Callback để đẩy bài post mới
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  trigger,
  onPostCreated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyPost>(PrivacyPost.Private);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  // Giả sử không sử dụng groupId trong ví dụ này

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  // Upload file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file, file.name);

      try {
        const uploadResponse = await axios.post(
          "http://localhost:5005/api/Upload/file",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (uploadResponse.data?.url) {
          setMediaUrl(uploadResponse.data.url);
          message.success("Tải file lên thành công!");
        } else {
          message.error("Lỗi khi tải file!");
        }
      } catch (error) {
        console.error("Lỗi khi tải file:", error);
        message.error("Lỗi khi tải file!");
      }
    }
  };

  // Đăng bài
  const handleOk = async () => {
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
        // Gọi callback nếu được truyền vào, truyền dữ liệu bài post mới (giả sử response.data chứa bài post mới)
        if (onPostCreated) {
          onPostCreated(response.data);
        }
        // Reset form
        setContent("");
        setMediaUrl("");
        setPrivacy(PrivacyPost.Private);
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsModalOpen(false);
    }
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
        width={500}
        className="rounded-lg overflow-hidden"
        closable={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-bold">Tạo bài viết</h2>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar src="https://i.pravatar.cc/80" size={48} />
            <div className="flex flex-col">
              <span className="font-medium text-base">
                Huy Hoang Nguyen The
              </span>
              <Select
                className="text-sm"
                value={privacy}
                onChange={(val) => setPrivacy(val)}
                style={{ width: 130 }}
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
            className="border-none focus:ring-0 focus:outline-none text-lg placeholder:text-gray-400"
            placeholder="Huy Hoang ơi, bạn đang nghĩ gì thế?"
            autoSize={{ minRows: 3, maxRows: 8 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Nút tải file kèm */}
          <div className="mt-4 flex items-center justify-between px-2 py-2 border rounded-lg bg-gray-50">
            <span className="text-gray-500 text-sm">
              Thêm vào bài viết của bạn
            </span>
            <div className="flex items-center gap-3">
              <button
                className="text-xl text-green-500 hover:text-green-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <AiOutlineFileImage />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*,application/*"
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

          {mediaUrl && (
            <div className="mt-3 p-2 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">Tệp đính kèm:</p>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                {mediaUrl}
              </a>
            </div>
          )}
        </div>

        {/* Nút Đăng trải dài */}
        <div className="px-4 py-3 border-t">
          <Button
            type="primary"
            className="rounded-full w-full"
            onClick={handleOk}
            disabled={!content.trim()}
          >
            Đăng
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreatePostModal;
