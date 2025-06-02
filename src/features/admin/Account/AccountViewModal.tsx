import { Modal, Spin, Descriptions, Avatar, Tag } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import type { Account } from "@/types/account";

interface AccountViewModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string | null;
}

const AccountViewModal = ({
  open,
  onClose,
  accountId,
}: AccountViewModalProps) => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (open && accountId) {
      setLoading(true);
      adminApi
        .getAccount(accountId)
        .then((res) => setAccount(res ?? null))
        .finally(() => setLoading(false));
    } else {
      setAccount(null);
    }
  }, [open, accountId]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Chi tiết tài khoản
        </span>
      }
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : account ? (
        <div className="flex flex-col items-center gap-4">
          <Avatar
            src={account.avatar}
            size={90}
            className="border-2 border-blue-200 shadow-md dark:border-blue-700 mb-2"
          />
          <div className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
            {account.fullName}
          </div>
          <Descriptions
            column={1}
            bordered
            className="w-full max-w-md [&_.ant-descriptions-item-label]:font-semibold [&_.ant-descriptions-item-label]:bg-gray-50 dark:[&_.ant-descriptions-item-label]:bg-gray-800 [&_.ant-descriptions-item-label]:text-gray-700 dark:[&_.ant-descriptions-item-label]:text-gray-200 [&_.ant-descriptions-item-content]:bg-white dark:[&_.ant-descriptions-item-content]:bg-gray-900"
          >
            <Descriptions.Item label="Email">{account.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {account.phoneNumber || (
                <span className="italic text-gray-400">Chưa cập nhật</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              {account.roles && account.roles.length > 0 ? (
                account.roles.map((role) => (
                  <Tag
                    key={role}
                    color={role === "ADMIN" ? "blue" : "default"}
                    className="font-semibold text-xs mr-1 mb-1"
                  >
                    {role}
                  </Tag>
                ))
              ) : (
                <Tag className="dark:bg-brand-500 dark:text-gray-200">
                  Không có
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {account.status === 1 && (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Hoạt động
                </span>
              )}
              {account.status === 2 && (
                <span className="text-red-500 dark:text-red-400 font-semibold">
                  Bị chặn
                </span>
              )}
              {account.status === 3 && (
                <span className="text-orange-500 dark:text-orange-400 font-semibold">
                  Bị khoá
                </span>
              )}
              {account.status === 4 && (
                <span className="text-gray-400 font-semibold">Đã xoá</span>
              )}
              {account?.status === undefined ||
                (![1, 2, 3, 4].includes(account.status) && (
                  <span className="text-gray-400 font-semibold">Không rõ</span>
                ))}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          Không tìm thấy tài khoản
        </div>
      )}
    </Modal>
  );
};

export default AccountViewModal;
