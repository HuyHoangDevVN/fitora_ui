import { adminApi } from "@/api/adminApi";
import { Descriptions, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
}

const CategoryViewModal = ({ open, onClose, categoryId }: Props) => {
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open && categoryId) {
      setLoading(true);
      adminApi
        .getCateory(categoryId)
        .then((res) => {
          // Handle both res.data and direct res structure
          const categoryData = res?.data || res;
          setCategory(categoryData);
        })
        .catch(() => {
          // notification.error({ message: "Không thể tải thông tin nhóm!" });
          console.error({ message: "Không thể tải thông tin nhóm!" });
          onClose();
        })
        .finally(() => setLoading(false));
    } else {
      setCategory(null);
    }
    // eslint-disable-next-line
  }, [open, categoryId]);

  return (
    <Modal
      open={open}
      title="Chi tiết chủ đề"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {category ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên chủ đề">
              {category.name}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {category.description || (
                <span className="text-gray-400">(Không có)</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Màu sắc">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: category.color || "#cccccc" }}
                />
                <span className="font-mono text-sm">
                  {category.color || "#cccccc"}
                </span>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Slug">
              {category.slug || (
                <span className="text-gray-400">(Không có)</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span
                className={
                  !category.isDeleted ? "text-green-600" : "text-red-500"
                }
              >
                {!category.isDeleted ? "Hoạt động" : "Đã xóa"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {category.createdAt
                ? new Date(category.createdAt).toLocaleString("vi-VN")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {category.lastModified
                ? new Date(category.lastModified).toLocaleString("vi-VN")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="ID">{category.id}</Descriptions.Item>
          </Descriptions>
        ) : (
          <div className="text-center text-gray-400">Không có dữ liệu</div>
        )}
      </Spin>
    </Modal>
  );
};

export default CategoryViewModal;
