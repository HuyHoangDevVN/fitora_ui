import { Modal, Form, Input, Button, Spin, notification, Avatar } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import type { Account } from "@/types/account";

interface AccountEditModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string | null;
  onSuccess?: () => void;
}

const AccountEditModal = ({
  open,
  onClose,
  accountId,
  onSuccess,
}: AccountEditModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (open && accountId) {
      setLoading(true);
      adminApi
        .getAccount(accountId)
        .then((res) => {
          setAccount(res.data ?? null);
          if (res) {
            form.setFieldsValue(res);
          } else {
            form.resetFields();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setAccount(null);
      form.resetFields();
    }
  }, [open, accountId, form]);

  const handleFinish = async (values: any) => {
    if (!accountId || !account) return;
    setSaving(true);
    try {
      const payload = {
        userId: accountId,
        email: account.email,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        avatar: account.avatar,
      };
      const res = await adminApi.updateAccount(payload);
      if (res?.isSuccess) {
        notification.success({ message: "Cập nhật tài khoản thành công" });
        onClose();
        onSuccess?.();
      } else {
        // notification.error({ message: res?.message || "Cập nhật thất bại" });
      }
    } catch {
      console.error({ message: "Có lỗi xảy ra khi cập nhật tài khoản" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Chỉnh sửa tài khoản
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
            className="border-2 border-blue-200 shadow dark:border-blue-700 mb-2 bg-white dark:bg-gray-800"
          />
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="w-full max-w-md space-y-3"
            initialValues={account}
            autoComplete="off"
          >
            <Form.Item
              label={
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Email
                </span>
              }
              name="email"
            >
              <Input className="dark:bg-gray-800 dark:text-white" disabled />
            </Form.Item>
            <Form.Item
              label={
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Họ tên
                </span>
              }
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input
                className="dark:bg-gray-800 dark:text-white"
                placeholder="Nhập họ tên"
                autoFocus
              />
            </Form.Item>
            <Form.Item
              label={
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Số điện thoại
                </span>
              }
              name="phoneNumber"
            >
              <Input
                className="dark:bg-gray-800 dark:text-white"
                placeholder="Nhập số điện thoại"
              />
            </Form.Item>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={onClose}
                className="dark:bg-gray-700 dark:text-gray-200 border-none px-6"
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 px-6 font-semibold"
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          Không tìm thấy tài khoản
        </div>
      )}
    </Modal>
  );
};

export default AccountEditModal;
