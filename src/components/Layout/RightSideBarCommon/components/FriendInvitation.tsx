import { userApi } from "@/api/userApi";
import { FriendInvite } from "@/types/friendInvite";
import { Avatar, Button, Flex, message } from "antd";
import { useState, useEffect, useCallback, useMemo, memo } from "react";

type FriendInvitationProp = {
  invite?: FriendInvite;
  type: "sent" | "received";
  onUpdate: () => void;
};

const FriendInvitation = memo(
  ({ invite, type, onUpdate }: FriendInvitationProp) => {
    const [status, setStatus] = useState<string | null>(null);

    const isReceived = useMemo(() => type === "received", [type]);

    const userImageUrl = useMemo(() => {
      return isReceived ? invite?.senderImageUrl : invite?.receiverImageUrl;
    }, [isReceived, invite?.senderImageUrl, invite?.receiverImageUrl]);

    const userName = useMemo(() => {
      return isReceived ? invite?.senderName : invite?.receiverName;
    }, [isReceived, invite?.senderName, invite?.receiverName]);

    useEffect(() => {
      if (status === "accepted" || status === "deleted") {
        const timer = setTimeout(() => {
          onUpdate();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [status, onUpdate]);

    const handleAccept = useCallback(async () => {
      if (!invite?.id) {
        message.error("Không tìm thấy ID lời mời.");
        return;
      }
      try {
        const response = await userApi.acceptFriendRequest(invite.senderId);
        if (response?.isSuccess) {
          message.success("Đã chấp nhận lời mời");
          setStatus("accepted");
        } else {
          message.error(response?.message || "Thao tác thất bại");
        }
      } catch (_error) {
        message.error("Lỗi hệ thống, vui lòng thử lại!");
      }
    }, [invite?.id, invite?.senderId]);

    const handleDelete = useCallback(async () => {
      if (!invite?.id) {
        message.error("Không tìm thấy ID lời mời.");
        return;
      }
      try {
        const response = await userApi.rejectFriendRequest(invite.senderId);
        if (response?.isSuccess) {
          message.success("Đã từ chối lời mời");
          setStatus("deleted");
        } else {
          message.error(response?.message || "Thao tác thất bại");
        }
      } catch (_error) {
        message.error("Lỗi hệ thống, vui lòng thử lại!");
      }
    }, [invite?.id, invite?.senderId]);

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
          <Flex vertical gap={10} className="friend-invitation-info">
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
  }
);

FriendInvitation.displayName = "FriendInvitation";

export default FriendInvitation;
