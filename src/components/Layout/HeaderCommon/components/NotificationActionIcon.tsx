import { useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Tooltip, message, Typography } from "antd";
import { groupApi } from "@/api/groupApi";

const NotificationActionIcon = () => {
  interface Invite {
    id: string;
    groupId: string;
    groupName: string;
    groupImageUrl: string;
    senderUserId: string;
    senderName: string;
    senderImageUrl: string;
    receiverUserId: string;
    receiverName: string;
    receiverImageUrl: string;
    status: number;
  }

  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvites = async () => {
      setLoading(true);
      try {
        const response = await groupApi.getReceivedGroupInvites({
          PageIndex: 0,
          PageSize: 10,
        });
        setInvites(response.data?.data ? response.data.data : []);
      } catch (_error) {
        message.error("Không thể lấy lời mời nhóm.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await groupApi.acceptGroupInvite({ Id: id });
      message.success("Đã chấp nhận lời mời.");
      setInvites((prev) => prev.filter((invite) => invite.groupId !== id));
    } catch (_error) {
      message.error("Không thể chấp nhận lời mời.");
    }
  };

  const handleDeny = async (id: string) => {
    try {
      await groupApi.deleteGroupInvite({ Id: id });
      message.success("Đã từ chối lời mời.");
      setInvites((prev) => prev.filter((invite) => invite.groupId !== id));
    } catch (_error) {
      message.error("Không thể từ chối lời mời.");
    }
  };

  const menu = (
    <div className="p-4 bg-white shadow-lg rounded-lg w-80">
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : invites.length === 0 ? (
        <div className="text-center text-gray-500">Không có thông báo.</div>
      ) : (
        invites?.map((item) => (
          <div
            key={item.groupId}
            className="flex flex-col items-center justify-between p-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center">
              <Avatar src={item.groupImageUrl} className="mr-3" />
              <div>
                <Typography.Text strong>{item.groupName}</Typography.Text>
                <div className="text-sm text-gray-500">
                  Gửi bởi: {item.senderName}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="link"
                className="text-blue-500"
                onClick={() => handleAccept(item.id)}
              >
                Chấp nhận
              </Button>
              <Button
                type="link"
                className="text-red-500"
                onClick={() => handleDeny(item.id)}
              >
                Từ chối
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <Tooltip title="Thông báo">
        <Button shape="circle" icon={<BellOutlined />} />
      </Tooltip>
    </Dropdown>
  );
};

export default NotificationActionIcon;
