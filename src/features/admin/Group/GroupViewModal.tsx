import { Modal, Spin, Descriptions, Avatar, Tag } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import { GroupResponse } from "@/types/group";
import { GroupPrivacy, GroupStatus } from "@/enums/group";

interface GroupViewModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string | null;
}

const GroupViewModal = ({ open, onClose, groupId }: GroupViewModalProps) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<GroupResponse | null>(null);

  useEffect(() => {
    if (open && groupId) {
      setLoading(true);
      adminApi
        .getGroup(groupId)
        .then((res) => setGroup(res?.data.group ?? null))
        .finally(() => setLoading(false));
    } else {
      setGroup(null);
    }
  }, [open, groupId]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Chi tiết nhóm
        </span>
      }
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : group ? (
        <div className="flex flex-col items-center gap-4">
          <Avatar
            src={group.avatarUrl}
            size={90}
            className="border-2 border-blue-200 shadow-md dark:border-blue-700 mb-2"
          />
          <div className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
            {group.name}
          </div>
          <Descriptions
            column={1}
            bordered
            className="w-full max-w-md [&_.ant-descriptions-item-label]:font-semibold [&_.ant-descriptions-item-label]:bg-gray-50 dark:[&_.ant-descriptions-item-label]:bg-gray-800 [&_.ant-descriptions-item-label]:text-gray-700 dark:[&_.ant-descriptions-item-label]:text-gray-200 [&_.ant-descriptions-item-content]:bg-white dark:[&_.ant-descriptions-item-content]:bg-gray-900"
          >
            <Descriptions.Item label="Mô tả">
              {group.description || (
                <span className="italic text-gray-400">Chưa có mô tả</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Quyền riêng tư">
              {group.privacy === GroupPrivacy.Public
                ? "Công khai"
                : group.privacy === GroupPrivacy.Private
                ? "Riêng tư"
                : group.privacy === GroupPrivacy.Secret
                ? "Bí mật"
                : "Không xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {group.status === GroupStatus.Active ? (
                <Tag color="green">Đang hoạt động</Tag>
              ) : (
                <Tag color="red">Đã khóa</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Số thành viên">
              {group.memberCount ?? 0} thành viên
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          Không tìm thấy nhóm
        </div>
      )}
    </Modal>
  );
};

export default GroupViewModal;
