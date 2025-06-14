import { adminApi } from "@/api/adminApi";
import { ColorPicker, Form, Input, Modal, notification, Spin } from "antd";
import { useEffect, useState } from "react";
import { Color } from "antd/es/color-picker";

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
  const [colorValue, setColorValue] = useState<string>("#1677ff");

  useEffect(() => {
    if (open && categoryId) {
      setFetching(true);
      adminApi
        .getCateory(categoryId)
        .then((res) => {
          const categoryData = res?.data || res;
          form.setFieldsValue({
            name: categoryData?.name,
            description: categoryData?.description,
            color: categoryData?.color || "#1677ff",
          });
          setColorValue(categoryData?.color || "#1677ff");
        })
        .catch(() => {
          // notification.error({ message: "Không thể tải thông tin chủ đề!" });
          console.error({ message: "Không thể tải thông tin chủ đề!" });
          onClose();
        })
        .finally(() => setFetching(false));
    } else {
      form.resetFields();
      setColorValue("#1677ff");
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
        color: values.color,
      });
      notification.success({ message: "Cập nhật chủ đề thành công!" });
      onSuccess();
    } catch (error: any) {
      if (error?.errorFields) return;
      // notification.error({ message: "Cập nhật chủ đề thất bại!" });
      console.error({ message: "Cập nhật chủ đề thất bại!" });
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
      title="Chỉnh sửa chủ đề"
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnClose
    >
      {" "}
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

export default CategoryEditModal;
