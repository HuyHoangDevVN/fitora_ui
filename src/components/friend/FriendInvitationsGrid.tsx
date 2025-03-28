import React from "react";
import { Row, Col } from "antd";
import { FriendInvite } from "@/types/FriendInvite";
import FriendInvitationCard from "./FriendInvitationCard";

type FriendInvitationsGridProps = {
  invites: FriendInvite[];
  onAccept: (inviteId: string) => void;
  onDelete: (inviteId: string) => void;
};

const FriendInvitationsGrid: React.FC<FriendInvitationsGridProps> = ({
  invites,
  onAccept,
  onDelete,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {invites.map((invite) => (
        <Col key={invite.id} xs={24} sm={12} md={8} lg={6} xl={4}>
          <FriendInvitationCard
            invite={invite}
            onAccept={onAccept}
            onDelete={onDelete}
          />
        </Col>
      ))}
    </Row>
  );
};

export default FriendInvitationsGrid;
