import { userRepository } from "@/api/repository";
import { ProfileUser } from "@/types/profileUser";
import { ResponseBase } from "@/types/responseBase";
import { Avatar, Button, Card, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isWatching, userId } = location.state || {};
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [relationship, setRelationship] = useState({
    isFriend: false,
    isFriendRequest: false,
    isFollowing: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url =
          isWatching && userId
            ? `https://localhost:5003/api/user/get-user?GetId=${userId}`
            : `/user/profile`;

        const response = await userRepository.get<ResponseBase<ProfileUser>>(
          url
        );
        if (response?.isSuccess && response.data) {
          setUser(response.data);
          setRelationship(
            response.data.relationship || {
              isFriend: false,
              isFriendRequest: false,
              isFollowing: false,
            }
          );
        } else {
          message.error(response?.message || "Không thể tải hồ sơ");
        }
      } catch (error) {
        message.error("Lỗi hệ thống, vui lòng thử lại!");
      }
    };

    fetchProfile();
  }, [isWatching, userId]);

  const handleAction = async (
    apiEndpoint: string,
    method: "POST" | "DELETE",
    successMessage: string,
    updateState: Partial<typeof relationship> & {
      followerCount?: number;
      followingCount?: number;
    }
  ) => {
    if (!userId) {
      message.error("Không tìm thấy ID người dùng.");
      return;
    }
    try {
      const response =
        method === "POST"
          ? await userRepository.post(apiEndpoint, userId)
          : await userRepository.delete(`${apiEndpoint}?id=${userId}`);

      if (response?.isSuccess) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                followerCount: updateState.followerCount ?? prev.followerCount,
                followingCount:
                  updateState.followingCount ?? prev.followingCount,
              }
            : prev
        );
        setRelationship((prev) => ({ ...prev, ...updateState }));
        message.success(successMessage);
      } else {
        message.error(response?.message || "Thao tác thất bại");
      }
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  return (
    <div className="flex justify-center p-8 bg-gray-100 min-h-full">
      <Card className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-xl">
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <Avatar
              size={120}
              src={user?.userInfo?.profilePictureUrl}
              className="border-4 border-gray-300"
            />
            <h2 className="text-xl font-semibold">
              {user.userInfo.firstName} {user.userInfo.lastName}
            </h2>
            <p className="text-gray-500">@{user.userName}</p>
            <p className="text-gray-600">
              {user.followerCount} người theo dõi · {user.followingCount} đang
              theo dõi
            </p>
            {!isWatching ? (
              <div className="flex gap-4">
                <Button
                  type="primary"
                  onClick={() => navigate("/edit-profile")}
                >
                  Chỉnh sửa hồ sơ
                </Button>
                <Button>Cài đặt</Button>
              </div>
            ) : (
              <div className="flex gap-4">
                {relationship.isFriend ? (
                  <Button
                    onClick={() =>
                      handleAction(
                        "friendShip/unfriend",
                        "DELETE",
                        "Hủy kết bạn thành công",
                        {
                          isFriend: false,
                        }
                      )
                    }
                  >
                    Hủy kết bạn
                  </Button>
                ) : relationship.isFriendRequest ? (
                  <Button
                    onClick={() =>
                      handleAction(
                        "friendShip/delete-request",
                        "DELETE",
                        "Hủy lời mời thành công",
                        { isFriendRequest: false }
                      )
                    }
                  >
                    Hủy lời mời
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() =>
                      handleAction(
                        "friendShip/add-friend",
                        "POST",
                        "Gửi lời mời kết bạn",
                        { isFriendRequest: true }
                      )
                    }
                  >
                    Kết bạn
                  </Button>
                )}
                {relationship.isFollowing ? (
                  <Button
                    onClick={() =>
                      handleAction(
                        "follow/unfollow",
                        "POST",
                        "Hủy theo dõi thành công",
                        {
                          isFollowing: false,
                          followerCount: user.followerCount - 1,
                        }
                      )
                    }
                  >
                    Hủy theo dõi
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() =>
                      handleAction("follow/follow", "POST", "Đã theo dõi", {
                        isFollowing: true,
                        followerCount: user.followerCount + 1,
                      })
                    }
                  >
                    Theo dõi
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Đang tải hồ sơ...</p>
        )}
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Sở thích AI & ML</h3>
          <p className="text-gray-500">Chưa có</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-lg">Tổ chức</h3>
          <p className="text-gray-500">Chưa có</p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
