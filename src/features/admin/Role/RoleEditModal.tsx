import { Modal, Form, Input, Button, Spin, notification } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import type { Role } from "@/types/role";

interface RoleEditModalProps {
  open: boolean;
  onClose: () => void;
  roleId: string | null;
  onSuccess?: () => void;
}

const RoleEditModal = ({
  open,
  onClose,
  roleId,
  onSuccess,
}: RoleEditModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    if (open && roleId) {
      setLoading(true);
      adminApi
        .getRole(roleId)
        .then((res) => {
          setRole(res?.data ?? null);
          if (res?.data) {
            form.setFieldsValue({
              roleName: res.data.roleName,
              roleId: res.data.roleId,
            });
          } else {
            form.resetFields();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setRole(null);
      form.resetFields();
    }
  }, [open, roleId, form]);

  const handleFinish = async (values: any) => {
    if (!roleId || !role) return;
    setSaving(true);
    try {
      const payload = {
        roleId: roleId,
        roleName: values.roleName,
      };
      const res = await adminApi.updateRole(payload);
      if (res?.isSuccess) {
        notification.success({ message: "Cập nhật vai trò thành công" });
        onClose();
        onSuccess?.();
      } else {
        // notification.error({ message: res?.message || "Cập nhật thất bại" });
        console.error({ message: res?.message || "Cập nhật thất bại" });
      }
    } catch {
      // notification.error({ message: "Có lỗi xảy ra khi cập nhật vai trò" });
      console.error({ message: "Có lỗi xảy ra khi cập nhật vai trò" });
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
          Chỉnh sửa vai trò
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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="w-full max-w-md space-y-3"
            initialValues={{ roleName: role.roleName, roleId: role.roleId }}
            autoComplete="off"
          >
            <Form.Item
              label={
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Mã vai trò
                </span>
              }
              name="roleId"
            >
              <Input className="dark:bg-gray-800 dark:text-white" disabled />
            </Form.Item>
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
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          Không tìm thấy vai trò
        </div>
      )}
    </Modal>
  );
};

export default RoleEditModal;
