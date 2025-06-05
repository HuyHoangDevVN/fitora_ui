import { Modal, Form, Input, Button, notification } from "antd";
import { useState } from "react";
import { adminApi } from "@/api/adminApi";

interface RoleCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RoleCreateModal = ({
  open,
  onClose,
  onSuccess,
}: RoleCreateModalProps) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleFinish = async (values: any) => {
    setSaving(true);
    try {
      const res = await adminApi.createRole(values.roleName);
      if (res) {
        notification.success({ message: "Tạo vai trò thành công" });
        onClose();
        onSuccess?.();
        form.resetFields();
      } else {
        console.error({ message: "Tạo vai trò thất bại" });
        // notification.error({ message: "Tạo vai trò thất bại" });
      }
    } catch {
      // notification.error({ message: "Có lỗi xảy ra khi tạo vai trò" });
      console.error({ message: "Có lỗi xảy ra khi tạo vai trò" });
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
          Tạo vai trò mới
        </span>
      }
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      centered
    >
      <div className="flex flex-col items-center gap-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="w-full max-w-md space-y-3"
          autoComplete="off"
        >
          <Form.Item
            label={
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Tên vai trò
              </span>
            }
            name="roleName"
            rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
          >
            <Input
              className="dark:bg-gray-800 dark:text-white"
              placeholder="Nhập tên vai trò"
              autoFocus
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
              Tạo mới
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default RoleCreateModal;
