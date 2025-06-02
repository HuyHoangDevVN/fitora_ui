import { Modal, Spin, Descriptions, Tag } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import type { Post } from "@/types/post";

interface PostViewModalProps {
  open: boolean;
  onClose: () => void;
  postId: string | null;
}

const PostViewModal = ({ open, onClose, postId }: PostViewModalProps) => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (open && postId) {
      setLoading(true);
      adminApi
        .getPost(postId)
        .then((res) => setPost(res?.data ?? null))
        .finally(() => setLoading(false));
    } else {
      setPost(null);
    }
  }, [open, postId]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Chi tiết bài viết
        </span>
      }
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : post ? (
        <div className="flex flex-col gap-4">
          <div className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
            {post.content?.slice(0, 40) +
              (post.content?.length > 40 ? "..." : "")}
          </div>
          <Descriptions column={1} bordered className="w-full max-w-md">
            <Descriptions.Item label="Tác giả">
              {post.user?.username || (
                <span className="italic text-gray-400">Chưa có</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đăng">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleString("vi-VN")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {!post.isDeleted ? (
                <Tag color="green">Hoạt động</Tag>
              ) : (
                <Tag color="red">Đã xóa</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              {post.content || (
                <span className="italic text-gray-400">Không có nội dung</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          Không tìm thấy bài viết
        </div>
      )}
    </Modal>
  );
};

export default PostViewModal;
