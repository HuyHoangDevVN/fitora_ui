import { adminApi } from "@/api/adminApi";
import { Form, Input, Modal, notification, Spin } from "antd";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryCreateModal = ({ open, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await adminApi.createCategory(values);
      notification.success({ message: "Tạo chủ đề thành công!" });
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return; // validation error
      notification.error({ message: "Tạo chủ đề thất bại!" });
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
      title="Tạo chủ đề mới"
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Tạo chủ đề"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnClose
    >
      <Spin spinning={loading}>
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

export default CategoryCreateModal;
