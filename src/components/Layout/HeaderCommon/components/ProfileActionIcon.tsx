import colors from "@/styles/colors";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";

const ProfileActionIcon = () => {
  return (
    <Space size={20}>
      <Avatar
        size={35}
        style={{ backgroundColor: colors.primary }}
        icon={<UserOutlined></UserOutlined>}
      ></Avatar>
    </Space>
  );
};

export default ProfileActionIcon;
