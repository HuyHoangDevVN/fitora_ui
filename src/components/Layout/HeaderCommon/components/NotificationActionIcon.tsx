import { BellOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const NotificationActionIcon = () => {
  return (
    <Tooltip title="Notification">
      <Button shape="circle" icon={<BellOutlined />} />
    </Tooltip>
  );
};

export default NotificationActionIcon;
