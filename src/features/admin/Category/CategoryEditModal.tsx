import { adminApi } from "@/api/adminApi";
import { Form, Input, Modal, notification, Spin } from "antd";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
  onSuccess: () => void;
}

const CategoryEditModal = ({ open, onClose, categoryId, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (open && categoryId) {
      setFetching(true);
      adminApi
        .getCateory(categoryId)
        .then((res) => {
          form.setFieldsValue({
            name: res?.data?.name,
            description: res?.data?.description,
          });
        })
        .catch(() => {
          notification.error({ message: "Không thể tải thông tin chủ đề!" });
          onClose();
        })
        .finally(() => setFetching(false));
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [open, categoryId]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (!categoryId) throw new Error("Thiếu ID chủ đề");
      await adminApi.updateCategory({
        id: categoryId,
        name: values.name,
        slug: values.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        description: values.description,
      });
      notification.success({ message: "Cập nhật chủ đề thành công!" });
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      notification.error({ message: "Cập nhật chủ đề thất bại!" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Chỉnh sửa chủ đề"
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnClose
    >
      <Spin spinning={fetching || loading}>
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Tên chủ đề"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên chủ đề!" }]}
          >
            <Input placeholder="Nhập tên chủ đề..." autoFocus />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea
              placeholder="Nhập mô tả (không bắt buộc)..."
              rows={3}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CategoryEditModal;
