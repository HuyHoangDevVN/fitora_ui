import { userRepository } from "@/_base/const/Repository";
import { FriendInvite } from "@/interfaces/FriendInvite";
import { PaginatedResult } from "@/interfaces/PaginatedResult";
import { ResponseBase } from "@/interfaces/ResponseBase";
import colors from "@/styles/colors";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import FriendInvitation from "./components/FriendInvitation";
import ListContactPerson from "./components/ListContactPerson";
import { User } from "@/interfaces/User";

const RightSideBar = () => {
  const [friendInvite, setFriendInvite] = useState<FriendInvite[]>([]);
  const [listContacts, setListContacts] = useState<User[]>([]);

  const getFriendInvitations = async () => {
    try {
      const response = await userRepository.get<
        ResponseBase<PaginatedResult<FriendInvite>>
      >(`/friendship/get-received-friend-requests`);
      const data = response?.data.data;
      if (response?.isSuccess && data) {
        setFriendInvite(data);
      }
    } catch (error) {
      message.error("Không thể tải lời mời kết bạn");
    }
  };

  const getListContacts = async () => {
    try {
      const response = await userRepository.get<
        ResponseBase<PaginatedResult<User>>
      >(`/friendship/get-friends`);
      const data = response?.data.data;
      if (response?.isSuccess && data) {
        setListContacts(data);
      }
    } catch (error) {
      message.error("Không thể tải danh sách bạn bè");
    }
  };

  useEffect(() => {
    getFriendInvitations();
    getListContacts();
  }, []);

  const handleUpdate = () => {
    getFriendInvitations();
    getListContacts();
  };

  return (
    <div className="bg-background text-textPrimary p-4 pb-32 h-full right-0 fixed border overflow-y-auto">
      {friendInvite.length !== 0 && (
        <>
          <Flex flex={"row"} justify="space-between" align="center">
            <h2 className="text-[20] font-semibold">Lời mời kết bạn</h2>
            <h2 className="text-[20] text-secondary font-semibold hover:underline ">
              Xem tất cả
            </h2>
          </Flex>
          <FriendInvitation
            invite={friendInvite[0]}
            type="received"
            onUpdate={handleUpdate}
          />
          <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
        </>
      )}
      <Flex align="center" justify="space-between">
        <h2 className="text-[20] font-semibold">Người liên hệ</h2>
        <Tooltip title="Tìm kiếm">
          <Button
            shape="circle"
            style={{ border: "none" }}
            icon={<SearchOutlined />}
          />
        </Tooltip>
      </Flex>
      <ListContactPerson people={listContacts} />
    </div>
  );
};

export default RightSideBar;
