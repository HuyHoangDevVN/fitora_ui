import { Button, Divider, Flex, Tooltip } from "antd";
import FriendInvitation from "./components/FriendInvitation";
import { friendInvite, listContacts } from "./fakeData";
import colors from "@/styles/colors";
import { SearchOutlined } from "@ant-design/icons";
import ListContactPerson from "./components/ListContactPerson";

const RightSideBar = () => {
  return (
    <aside className="bg-background text-textPrimary  p-4 pb-32 h-full right-0 fixed border overflow-y-auto">
      <Flex flex={"row"} justify="space-between" align="center">
        <h2 className="text-[20]  font-semibold">Lời mời kết bạn</h2>
        <h2 className="text-[20] text-secondary font-semibold hover:underline ">
          Xem tất cả
        </h2>
      </Flex>
      <FriendInvitation user={friendInvite[0]} />
      <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
      <Flex align="center" justify="space-between">
        <h2 className="text-[20]  font-semibold">Người liên hệ</h2>
        <Tooltip title="Tìm kiếm">
          <Button
            shape="circle"
            style={{ border: "none" }}
            icon={<SearchOutlined />}
          />
        </Tooltip>
      </Flex>
      <ListContactPerson people={listContacts} />
    </aside>
  );
};

export default RightSideBar;
