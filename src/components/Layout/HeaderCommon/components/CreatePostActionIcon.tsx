import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import colors from "@/styles/colors";

const CreatePostActionIcon = () => {
  return (
    <Button
      style={{ borderRadius: "15px", backgroundColor: colors.primary }}
      type="primary"
      icon={<PlusOutlined />}
    >
      Đăng bài
    </Button>
  );
};

export default CreatePostActionIcon;
