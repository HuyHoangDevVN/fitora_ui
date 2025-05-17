import React, { useEffect, useState, Suspense, lazy } from "react";
import { message, Spin } from "antd";
import { FriendInvite } from "@/types/friendInvite";
import { userRepository } from "@/api/repository";
import FriendMenu from "@/components/friend/FriendMenu";
import { userApi } from "@/api/userApi";

const FriendInvitationsGrid = lazy(
  () => import("@/components/friend/FriendInvitationsGrid")
);

const FriendRequestPage: React.FC = () => {
  const [invites, setInvites] = useState<FriendInvite[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("friend-requests");

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const response = await userRepository.get(
        "/friendship/get-received-friend-requests"
      );
      if (response?.isSuccess) {
        setInvites(response.data.data || []);
      } else {
        message.error(response?.message || "Không thể tải lời mời kết bạn");
      }
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await userApi.getListFriends({
        pageIndex: 0,
        pageSize: 10,
      });
      if (response?.isSuccess) {
        setFriends(response.data.data || []);
      } else {
        message.error(response?.message || "Không thể tải danh sách bạn bè");
      }
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  const handleAccept = async (inviteId: string) => {
    try {
      const res = await userRepository.put("friendship/accept-friend-request", {
        id: inviteId,
      });
      if (res?.isSuccess) {
        message.success("Đã chấp nhận lời mời");
        setInvites((prev) => prev.filter((item) => item.id !== inviteId));
      } else {
        message.error(res?.message || "Thao tác thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDelete = async (inviteId: string) => {
    try {
      const res = await userRepository.delete(
        `friendship/delete-request?id=${inviteId}`
      );
      if (res?.isSuccess) {
        message.success("Đã xóa lời mời");
        setInvites((prev) => prev.filter((item) => item.id !== inviteId));
      } else {
        message.error(res?.message || "Thao tác thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    fetchInvites();
    fetchFriends();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "friend-requests":
        return loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : invites.length === 0 ? (
          <p className="text-center">Không có lời mời nào</p>
        ) : (
          <Suspense fallback={<Spin size="large" />}>
            <FriendInvitationsGrid
              invites={invites}
              onAccept={handleAccept}
              onDelete={handleDelete}
            />
          </Suspense>
        );
      case "suggestions":
        return <p>Gợi ý bạn bè</p>;
      case "all-friends":
        return friends.length === 0 ? (
          <p className="text-center">Không có bạn bè nào</p>
        ) : (
          <ul>
            {friends?.map((friend) => (
              <li key={friend.id}>{friend.userName}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100 p-4 gap-4">
      <div className="w-1/4">
        <FriendMenu onTabChange={setActiveTab} activeTab={activeTab} />
      </div>

      <div className="w-3/4 bg-white p-4 rounded-md shadow">
        {renderContent()}
      </div>
    </div>
  );
};

export default FriendRequestPage;
