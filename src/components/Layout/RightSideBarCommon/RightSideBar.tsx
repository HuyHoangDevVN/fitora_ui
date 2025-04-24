import { useState } from "react";
import {
  fetchFriends,
  fetchFriendInvitations,
} from "@/features/users/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import colors from "@/styles/colors";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Tooltip } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendInvitation from "./components/FriendInvitation";
import ListContactPerson from "./components/ListContactPerson";

const RightSideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    friendInvitations,
    contacts,
    loading: _loading,
  } = useSelector((state: RootState) => state.user);

  const [currentInvitationIndex, setCurrentInvitationIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchFriendInvitations());
    dispatch(fetchFriends({ pageIndex: 0, pageSize: 15 }));
  }, [dispatch]);

  const handleUpdate = () => {
    setTimeout(() => {
      setCurrentInvitationIndex((prevIndex) => prevIndex + 1);
    }, 2000);
  };

  return (
    <div className="bg-background text-textPrimary p-4 pb-32 h-full w-[280px] right-0 sticky top-0 overflow-y-auto">
      {friendInvitations.length !== 0 &&
        currentInvitationIndex < friendInvitations.length && (
          <>
            <Flex flex={"row"} justify="space-between" align="center">
              <h2 className="text-[20] font-semibold mb-3">Lời mời kết bạn</h2>
              <h2 className="text-[20] text-secondary font-semibold hover:underline ">
                Xem tất cả
              </h2>
            </Flex>
            <FriendInvitation
              invite={friendInvitations[currentInvitationIndex]}
              type="received"
              onUpdate={handleUpdate}
            />
            <Divider
              style={{ borderColor: colors.border, margin: "15px 0px" }}
            />
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
      <ListContactPerson people={contacts} />
    </div>
  );
};

export default RightSideBar;
