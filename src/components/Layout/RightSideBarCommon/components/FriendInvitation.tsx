import { Avatar, Button, Flex } from "antd";
import { FriendInvite } from "../interfaces";

type FriendInvitationProp = {
  user?: FriendInvite;
};

const FriendInvitation = ({ user }: FriendInvitationProp) => {
  return (
    <div style={{ marginTop: 15, width: "100%" }}>
      <Flex align="center" gap={10} style={{ width: "100%" }}>
        <Avatar size={50} src={user?.image} />
        <Flex vertical gap={5} style={{ width: "100%" }}>
          <h2 className="font-[500] text-[14]">{user?.name}</h2>
          <Flex
            gap={10}
            align="center"
            justify="space-between"
            style={{ width: "100%", fontWeight: "500" }}
          >
            <Button type="primary" style={{ width: "100%" }}>
              Chấp nhận
            </Button>
            <Button type="default" style={{ width: "100%" }}>
              Từ chối
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default FriendInvitation;
