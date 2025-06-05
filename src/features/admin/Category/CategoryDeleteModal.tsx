import { adminApi } from "@/api/adminApi";
import { Modal, notification } from "antd";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
  categoryName: string;
  onSuccess: () => void;
}

const CategoryDeleteModal = ({
  open,
  onClose,
  categoryId,
  categoryName,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      await adminApi.deleteCategory(categoryId);
      notification.success({ message: "Xóa nhóm thành công!" });
      onSuccess();
    } catch {
      // notification.error({ message: "Xóa nhóm thất bại!" });
      console.error({ message: "Xóa nhóm thất bại!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Xác nhận xóa nhóm"
      onCancel={onClose}
      onOk={handleDelete}
      okText="Xóa"
      okButtonProps={{ danger: true, loading }}
      cancelText="Hủy"
      destroyOnClose
    >
      <div className="text-base">
        Bạn có chắc chắn muốn xóa nhóm{" "}
        <span className="font-semibold text-red-600">{categoryName}</span>{" "}
        không?
      </div>
    </Modal>
  );
};

export default CategoryDeleteModal;
