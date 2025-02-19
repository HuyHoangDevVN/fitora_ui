import { useAuth } from "@/_base/auth/AuthProvider";
import colors from "@/styles/colors";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Popover, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileActionIcon = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "");

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const content = (
    <div className="w-[200px] flex flex-col items-start gap-3">
      <button
        className="flex flex-col items-start w-max"
        onClick={() => navigate("/profile")}
      >
        <p>Profile</p>
        <div className="flex flex-row items-center justify-between gap-2">
          <Avatar
            size={25}
            style={{ backgroundColor: colors.primary }}
            icon={<UserOutlined />}
          />
          <p className="text-lg font-[500]">{userInfo.fullName}</p>
        </div>
      </button>
      <Divider style={{ borderColor: colors.border, margin: "0px 0px" }} />

      <button
        className="text-base hover:underline-offset-1"
        onClick={() => logout()}
      >
        Đăng xuất
      </button>
    </div>
  );

  return (
    <Space size={20}>
      <Popover
        content={content}
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Avatar
          size={35}
          style={{ backgroundColor: colors.primary }}
          icon={<UserOutlined />}
        />
      </Popover>
    </Space>
  );
};

export default ProfileActionIcon;
