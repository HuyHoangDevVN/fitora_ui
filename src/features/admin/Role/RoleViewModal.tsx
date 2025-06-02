import { Modal, Spin, Descriptions } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import type { Role } from "@/types/role";

interface RoleViewModalProps {
  open: boolean;
  onClose: () => void;
  roleId: string | null;
}

const RoleViewModal = ({ open, onClose, roleId }: RoleViewModalProps) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    if (open && roleId) {
      setLoading(true);
      adminApi
        .getRole(roleId)
        .then((res) => setRole(res.data ?? null))
        .finally(() => setLoading(false));
    } else {
      setRole(null);
    }
  }, [open, roleId]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Chi tiết vai trò
        </span>
      }
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : role ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
            {role.roleName}
          </div>
          <Descriptions
            column={1}
            bordered
            className="w-full max-w-md [&_.ant-descriptions-item-label]:font-semibold [&_.ant-descriptions-item-label]:bg-gray-50 dark:[&_.ant-descriptions-item-label]:bg-gray-800 [&_.ant-descriptions-item-label]:text-gray-700 dark:[&_.ant-descriptions-item-label]:text-gray-200 [&_.ant-descriptions-item-content]:bg-white dark:[&_.ant-descriptions-item-content]:bg-gray-900"
          >
            <Descriptions.Item label="Số lượng người dùng">
              {role.totalUser ?? 0} người dùng
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          Không tìm thấy vai trò
        </div>
      )}
    </Modal>
  );
};

export default RoleViewModal;
