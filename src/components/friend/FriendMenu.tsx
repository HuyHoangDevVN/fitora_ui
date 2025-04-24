import {
  TeamOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";

interface FriendMenuProps {
  onTabChange: (key: string) => void;
  activeTab: string;
}

const FriendMenu: React.FC<FriendMenuProps> = ({ onTabChange, activeTab }) => {
  const handleMenuClick = (e: { key: string }) => {
    onTabChange(e.key);
  };

  return (
    <div className="bg-white rounded-md shadow p-2">
      <Menu mode="inline" selectedKeys={[activeTab]} onClick={handleMenuClick}>
        <Menu.Item key="friend-requests" icon={<UserAddOutlined />}>
          Lời mời kết bạn
        </Menu.Item>
        <Menu.Item key="suggestions" icon={<UsergroupAddOutlined />}>
          Gợi ý
        </Menu.Item>
        <Menu.Item key="all-friends" icon={<UnorderedListOutlined />}>
          Tất cả bạn bè
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default FriendMenu;
