import { PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Space,
  Dropdown,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import React, { useState } from "react";
import { BsDot } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { RiShareForwardLine } from "react-icons/ri";
import axios from "axios";

// Ví dụ hàm timeToLast, bạn có thể thay bằng logic khác
import { Post } from "@/interfaces/Post";
import { timeToLast } from "@/utils/FunctionHelpper";

type PostBoxProps = {
  post: Post;
};

const PostBox: React.FC<PostBoxProps> = ({ post }) => {
  // Sử dụng avatar mặc định nếu API không trả về avatar
  const defaultAvatar = "https://i.pravatar.cc/40";

  // Đặt mặc định cho vote và comment nếu API không có dữ liệu
  const voteQuantity = 0;
  const numberOfComments = 0;

  // State cho modal chỉnh sửa
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editMediaUrl, setEditMediaUrl] = useState(post.mediaUrl);

  // Xử lý khi chọn "Edit"
  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  // Xử lý cập nhật bài viết thông qua API PUT
  const handleEditOk = async () => {
    try {
      await axios.put(`http://localhost:5005/api/post/update-post/${post.id}`, {
        content: editContent,
        mediaUrl: editMediaUrl,
        privacy: 0,
      });
      setIsEditModalVisible(false);
      message.success("Cập nhật bài viết thành công");
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Cập nhật bài viết thất bại");
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Xử lý khi chọn "Delete"
  const handleDelete = () => {
    Modal.confirm({
      title: "Xóa bài viết",
      content: "Bạn có chắc muốn xóa bài viết này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axios.delete(
            `http://localhost:5005/api/post/delete-post/${post.id}`
          );
          message.success("Xóa bài viết thành công");
        } catch (error) {
          console.error("Error deleting post:", error);
          message.error("Xóa bài viết thất bại");
        }
      },
    });
  };

  // Các mục của dropdown
  const menuItems = [
    {
      key: "edit",
      label: "Edit",
    },
    {
      key: "delete",
      label: "Delete",
    },
  ];

  // Xử lý khi chọn mục trong dropdown
  const handleMenuClick = (e: any) => {
    if (e.key === "edit") {
      handleEdit();
    } else if (e.key === "delete") {
      handleDelete();
    }
  };

  return (
    <div className="post-box mb-3 border rounded-md p-3 bg-white shadow-sm">
      {/* Header */}
      <div className="post-header flex justify-between items-center">
        <div className="post-info flex items-center gap-2">
          <Avatar src={defaultAvatar} />
          {/* Giả định categoryName là 'general' hoặc ẩn đi */}
          <h2 className="category-name text-xs font-semibold cursor-pointer">
            f/general
          </h2>
          <BsDot />
          <span className="create-date text-xs font-semibold">
            {timeToLast(new Date(post.createdDate))}
          </span>
        </div>
        <Space>
          <Button
            className="follow-btn bg-primary rounded-2xl hover:bg-primary"
            icon={<PlusOutlined />}
            type="primary"
            size="small"
          >
            Theo dõi
          </Button>
          <Dropdown
            menu={{
              items: menuItems,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
          >
            <IoIosMore className="icon-more cursor-pointer text-lg" />
          </Dropdown>
        </Space>
      </div>

      {/* Nội dung */}
      <div className="post-content mt-3">
        <p className="post-text text-sm mb-2">{post.content}</p>
        {post.mediaUrl && post.mediaUrl.trim() !== "" && (
          <div className="w-full h-64 overflow-hidden rounded-md mt-2">
            <img
              src={post.mediaUrl}
              alt="post-media"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="post-footer flex items-center gap-2 mt-3">
        <div className="vote-controls flex items-center bg-gray-100 rounded-2xl px-2">
          <Button type="text" icon={<PiArrowFatUpLight />} />
          <span className="vote-count text-xs font-medium">{voteQuantity}</span>
          <Button type="text" icon={<PiArrowFatDownLight />} />
        </div>
        <Button
          className="comment-btn bg-gray-100 rounded-2xl flex items-center gap-1"
          icon={<FaRegComment />}
          type="text"
          size="small"
        >
          {numberOfComments}
        </Button>
        <Button
          className="share-btn bg-gray-100 rounded-2xl flex items-center gap-1"
          icon={<RiShareForwardLine />}
          type="text"
          size="small"
        >
          Share
        </Button>
      </div>

      {/* Modal chỉnh sửa bài viết */}
      <Modal
        title="Chỉnh sửa bài viết"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Nội dung">
            <Input.TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Media URL">
            <Input
              value={editMediaUrl}
              onChange={(e) => setEditMediaUrl(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostBox;
