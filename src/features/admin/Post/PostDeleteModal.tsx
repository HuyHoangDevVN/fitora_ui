import { Modal, Button, Spin } from "antd";
import { useState } from "react";
import { adminApi } from "@/api/adminApi";

interface PostDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  postId?: string;
  postTitle?: string;
}

const PostDeleteModal = ({
  open,
  onClose,
  onSuccess,
  postId,
  postTitle,
}: PostDeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await adminApi.deletePost(postId);
      if (res?.isSuccess) {
        onSuccess?.();
        onClose();
      } else {
        Modal.error({
          title: "Xóa bài viết thất bại",
          content: res?.message || "Không thể xóa bài viết. Vui lòng thử lại!",
        });
      }
    } catch {
      Modal.error({
        title: "Lỗi hệ thống",
        content: "Không thể xóa bài viết. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      title={
        <span className="text-lg font-bold text-red-600 dark:text-red-400">
          Xác nhận xóa bài viết
        </span>
      }
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="text-center text-base text-gray-700 dark:text-gray-200">
          Bạn có chắc chắn muốn xóa bài viết
          <span className="font-semibold text-red-600 dark:text-red-400">
            {postTitle ? ` ${postTitle} ` : " này "}
          </span>
          ?<br />
          Hành động này không thể hoàn tác.
        </div>
        <div className="flex justify-end gap-2 w-full mt-4">
          <Button
            onClick={onClose}
            disabled={loading}
            className="dark:bg-gray-700 dark:text-gray-200 border-none px-6"
          >
            Huỷ
          </Button>
          <Button
            danger
            type="primary"
            loading={loading}
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 px-6 font-semibold"
          >
            Xóa
          </Button>
        </div>
        {loading && <Spin />}
      </div>
    </Modal>
  );
};

export default PostDeleteModal;
