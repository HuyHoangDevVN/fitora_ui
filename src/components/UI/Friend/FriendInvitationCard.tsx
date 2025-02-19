import React from "react";
import { Avatar, Button, Card } from "antd";
import { FriendInvite } from "@/interfaces/FriendInvite";

type FriendInvitationCardProps = {
  invite: FriendInvite;
  onAccept: (inviteId: string) => void;
  onDelete: (inviteId: string) => void;
};

const FriendInvitationCard: React.FC<FriendInvitationCardProps> = ({
  invite,
  onAccept,
  onDelete,
}) => {
  return (
    <Card
      className="w-max rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
      bodyStyle={{ padding: 0 }}
    >
      {/* Phần thông tin */}
      <div className="flex flex-col items-center p-4">
        <Avatar
          size={80}
          src={invite.senderImageUrl || ""}
          className="border-2 border-gray-300 "
        />
        <p className="mt-3 text-base font-semibold text-gray-800">
          {invite.senderName}
        </p>
      </div>

      {/* Đường kẻ ngang để tách nút */}
      <div className="border-t border-gray-200" />

      {/* Phần nút hành động */}
      <div className="flex justify-center items-center gap-3 p-3">
        <Button type="primary" onClick={() => onAccept(invite.id)}>
          Xác nhận
        </Button>
        <Button danger onClick={() => onDelete(invite.id)}>
          Xóa
        </Button>
      </div>
    </Card>
  );
};

export default FriendInvitationCard;
