import { Modal, Form, Button, Spin, notification } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import { Account } from "@/types/account";
import RoleSelect from "@/components/admin/RoleSelect";

interface AssignRoleModalProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
  onSuccess?: () => void;
}

const AssignRoleModal = ({
  open,
  onClose,
  account,
  onSuccess,
}: AssignRoleModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      adminApi
        .getRoles({ pageIndex: 0, pageSize: 100 })
        .finally(() => setLoading(false));
      if (account) {
        form.setFieldsValue({ roleNames: account.roles });
      } else {
        form.resetFields();
      }
    }
  }, [open, account, form]);

  const handleFinish = async (values: any) => {
    if (!account) return;
    setSaving(true);
    try {
      // Chỉ gửi các vai trò mới được chọn mà user chưa có
      const currentRoles = account.roles || [];
      const newRoles = (values.roleNames || []).filter(
        (role: string) => !currentRoles.includes(role)
      );
      if (newRoles.length === 0) {
        notification.info({ message: "Không có vai trò mới để phân quyền" });
        setSaving(false);
        return;
      }
      const res = await adminApi.assignRole({
        email: account.email,
        roleNames: newRoles,
      });
      if (res?.isSuccess) {
        notification.success({ message: "Phân quyền thành công" });
        onClose();
        onSuccess?.();
      } else {
        notification.error({ message: res?.message || "Phân quyền thất bại" });
      }
    } catch {
      notification.error({ message: "Có lỗi xảy ra khi phân quyền" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveRole = async (roleName: string) => {
    if (!account) return;
    setRemoving(true);
    try {
      const res = await adminApi.removeRole({
        email: account.email,
        roleNames: [roleName],
      });
      if (res?.isSuccess) {
        notification.success({ message: `Đã xóa vai trò ${roleName}` });
        // Cập nhật lại form value sau khi xóa
        const currentRoles = form.getFieldValue("roleNames") || [];
        form.setFieldsValue({
          roleNames: currentRoles.filter((r) => r !== roleName),
        });
        onSuccess?.();
      } else {
        notification.error({
          message: res?.message || `Xóa vai trò ${roleName} thất bại`,
        });
      }
    } catch {
      notification.error({ message: `Có lỗi khi xóa vai trò ${roleName}` });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Phân quyền tài khoản
        </span>
      }
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      centered
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
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
                Chọn vai trò
              </span>
            }
            name="roleNames"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 vai trò" },
            ]}
          >
            <RoleSelect
              value={form.getFieldValue("roleNames")}
              onChange={(value) => form.setFieldsValue({ roleNames: value })}
              disabled={saving || removing}
            />
          </Form.Item>
          {/* Vai trò đã gán */}
          {form.getFieldValue("roleNames")?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {form.getFieldValue("roleNames").map((role: string) => (
                <Button
                  key={role}
                  size="small"
                  danger
                  loading={removing}
                  onClick={() => handleRemoveRole(role)}
                  className="!bg-red-500 hover:!bg-red-600 dark:!bg-red-700 dark:hover:!bg-red-800 !text-white !border-none"
                >
                  Xóa {role}
                </Button>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={onClose}
              className="dark:bg-gray-700 dark:text-gray-200 border-none px-6"
              disabled={saving || removing}
            >
              Huỷ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 px-6 font-semibold"
              disabled={saving || removing}
            >
              Lưu phân quyền
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default AssignRoleModal;
