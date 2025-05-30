import { refreshAccessToken } from "@/api/authApi";
import { MessageOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const MessageActionIcon = () => {
  return (
    <Tooltip title="Message">
      <Button
        onClick={() => {
          refreshAccessToken();
        }}
        shape="circle"
        icon={<MessageOutlined />}
      />
    </Tooltip>
  );
};

export default MessageActionIcon;
