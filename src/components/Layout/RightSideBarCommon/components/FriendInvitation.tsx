import { FriendInvite } from "@/interfaces/FriendInvite";
import { Avatar, Button, Flex } from "antd";

type FriendInvitationProp = {
  invite?: FriendInvite;
  type: "sent" | "received";
};

const FriendInvitation = ({ invite, type }: FriendInvitationProp) => {
  const isReceived = type === "received";
  const userImageUrl = isReceived
    ? invite?.senderImageUrl
    : invite?.receiverImageUrl;
  const userName = isReceived ? invite?.senderName : invite?.receiverName;

  return (
    <div className="friend-invitation">
      <Flex align="center" gap={10} className="friend-invitation-container">
        <Avatar size={50} src={userImageUrl} />
        <Flex vertical gap={5} className="friend-invitation-info">
          <h2 className="font-semibold text-sm">{userName}</h2>
          <Flex
            gap={10}
            align="center"
            justify="space-between"
            className="friend-invitation-buttons"
          >
            <Button type="primary" className="full-width">
              Chấp nhận
            </Button>
            <Button type="default" className="full-width">
              Từ chối
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default FriendInvitation;
