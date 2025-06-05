import { adminApi } from "@/api/adminApi";
import { Descriptions, Modal, Spin, notification } from "antd";
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
        .then((res) => setCategory(res))
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
      title="Chi tiết nhóm"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {category ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên nhóm">
              {category.name}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {category.description || (
                <span className="text-gray-400">(Không có)</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span
                className={
                  category.isActive ? "text-green-600" : "text-red-500"
                }
              >
                {category.isActive ? "Hoạt động" : "Đã khóa"}
              </span>
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
