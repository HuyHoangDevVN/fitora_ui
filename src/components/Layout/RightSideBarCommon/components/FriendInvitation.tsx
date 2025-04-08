import { acceptFriendRequestApi, rejectFriendRequestApi } from "@/api/userApi";
import { FriendInvite } from "@/types/friendInvite";
import { Avatar, Button, Flex, message } from "antd";
import { useState } from "react";

type FriendInvitationProp = {
  invite?: FriendInvite;
  type: "sent" | "received";
  onUpdate: () => void;
};

const FriendInvitation = ({ invite, type, onUpdate }: FriendInvitationProp) => {
  const isReceived = type === "received";
  const userImageUrl = isReceived
    ? invite?.senderImageUrl
    : invite?.receiverImageUrl;
  const userName = isReceived ? invite?.senderName : invite?.receiverName;
  const [status, setStatus] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!invite?.id) {
      message.error("Không tìm thấy ID lời mời.");
      return;
    }
    try {
      const response = await acceptFriendRequestApi(invite.senderId);
      if (response?.isSuccess) {
        message.success("Đã chấp nhận lời mời");
        setStatus("accepted");
        onUpdate();
      } else {
        message.error(response?.message || "Thao tác thất bại");
      }
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    if (!invite?.id) {
      message.error("Không tìm thấy ID lời mời.");
      return;
    }
    try {
      const response = await rejectFriendRequestApi(invite.senderId);
      if (response?.isSuccess) {
        message.success("Đã từ chối lời mời");
        setStatus("deleted");
        onUpdate();
      } else {
        message.error(response?.message || "Thao tác thất bại");
      }
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  if (status === "accepted") {
    return <p className="text-green-500">Đã là bạn bè</p>;
  }

  if (status === "deleted") {
    return null;
  }

  return (
    <div className="friend-invitation">
      <Flex align="center" gap={10} className="friend-invitation-container">
        <Avatar size={50} src={userImageUrl} />
        <Flex vertical gap={5} className="friend-invitation-info">
          <h2 className="font-semibold text-sm">{userName}</h2>
          {isReceived && (
            <Flex
              gap={10}
              align="center"
              justify="space-between"
              className="friend-invitation-buttons"
            >
              <Button
                type="primary"
                className="full-width"
                onClick={handleAccept}
              >
                Chấp nhận
              </Button>
              <Button
                type="default"
                className="full-width"
                onClick={handleDelete}
              >
                Từ chối
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default FriendInvitation;
