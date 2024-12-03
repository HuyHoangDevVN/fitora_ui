import { TeamOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const FriendActionIcon = () => {
  return (
    <Tooltip title="Friend">
      <Button shape="circle" icon={<TeamOutlined />} />
    </Tooltip>
  );
};

export default FriendActionIcon;
