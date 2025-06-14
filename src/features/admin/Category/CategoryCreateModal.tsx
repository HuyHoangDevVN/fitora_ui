import { adminApi } from "@/api/adminApi";
import { ColorPicker, Form, Input, Modal, notification, Spin } from "antd";
import { useState } from "react";
import { Color } from "antd/es/color-picker";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryCreateModal = ({ open, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colorValue, setColorValue] = useState<string>("#1677ff");

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await adminApi.createCategory({
        ...values,
        color: values.color || "#1677ff",
      });
      notification.success({ message: "Tạo chủ đề thành công!" });
      form.resetFields();
      setColorValue("#1677ff");
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      // notification.error({ message: "Tạo chủ đề thất bại!" });
      console.error({ message: "Tạo chủ đề thất bại!" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setColorValue("#1677ff");
    onClose();
  };

  const handleColorChange = (color: Color, hex: string) => {
    const colorString = typeof color === "string" ? color : hex;
    setColorValue(colorString);
    form.setFieldValue("color", colorString);
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
      {" "}
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

          <Form.Item label="Màu sắc" name="color" initialValue="#1677ff">
            <div className="flex items-center gap-2">
              <ColorPicker
                value={colorValue}
                onChange={handleColorChange}
                showText
                format="hex"
                presets={[
                  {
                    label: "Recommended",
                    colors: [
                      "#F5222D",
                      "#FA8C16",
                      "#FADB14",
                      "#8BBB11",
                      "#52C41A",
                      "#13A8A8",
                      "#1677FF",
                      "#2F54EB",
                      "#722ED1",
                      "#EB2F96",
                    ],
                  },
                ]}
              />
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: colorValue }}
              />
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CategoryCreateModal;
