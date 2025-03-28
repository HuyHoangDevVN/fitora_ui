import React from "react";
import { Menu } from "antd";
import {
  UserAddOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  GiftOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const FriendMenu: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-md shadow p-2">
      <Menu mode="inline" defaultSelectedKeys={["friend-requests"]}>
        <Menu.Item
          key="home"
          icon={<TeamOutlined />}
          onClick={() => navigate("/personal")}
        >
          Trang chủ
        </Menu.Item>
        <Menu.Item key="friend-requests" icon={<UserAddOutlined />}>
          Lời mời kết bạn
        </Menu.Item>
        <Menu.Item key="suggestions" icon={<UsergroupAddOutlined />}>
          Gợi ý
        </Menu.Item>
        <Menu.Item key="all-friends" icon={<UnorderedListOutlined />}>
          Tất cả bạn bè
        </Menu.Item>
        <Menu.Item key="birthdays" icon={<GiftOutlined />}>
          Sinh nhật
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default FriendMenu;
