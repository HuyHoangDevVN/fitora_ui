import { interactRepository, userRepository } from "@/api/repository";
import { userApi } from "@/api/userApi";
import PostBox from "@/components/posts/PostBox";
import { PaginatedCursorResult } from "@/types/paginatedCrusorResult";
import { Post } from "@/types/post";
import { ProfileUser } from "@/types/profileUser";
import { ResponseBase } from "@/types/responseBase";
import { User } from "@/types/user";
import { Avatar, Button, Dropdown, Skeleton, Spin, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { isWatching } = location.state || {};

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [relationship, setRelationship] = useState({
    isFriend: false,
    isFriendRequest: false,
    isFollowing: false,
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("posts");

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    setIsProfileLoading(true);
    try {
      const endpoint =
        isWatching && userId
          ? `/user/get-user?GetId=${userId}`
          : `/user/profile`;
      const response = await userRepository.get<ResponseBase<ProfileUser>>(
        endpoint
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
        message.error("Không thể tải hồ sơ");
      }
    } catch {
      message.error("Lỗi khi tải hồ sơ, vui lòng thử lại!");
    } finally {
      setIsProfileLoading(false);
    }
  }, [isWatching, userId]);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const url = `/post/personal?${
        isWatching && userId ? `Id=${userId}&` : ""
      }Limit=4${nextCursor ? `&Cursor=${nextCursor}` : ""}`;
      const response = await interactRepository.get<
        ResponseBase<PaginatedCursorResult<Post>>
      >(url);

      if (response?.isSuccess && response.data) {
        setPosts((prev) => [
          ...prev,
          ...response.data.data.filter(
            (post) => !prev.some((p) => p.id === post.id)
          ),
        ]);
        setNextCursor(response.data.nextCursor);
        setHasMore(response.data.nextCursor !== null);
      } else {
        message.error(response?.message || "Không thể tải bài viết");
      }
    } catch {
      message.error("Lỗi khi tải bài viết, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [isWatching, userId, nextCursor, loading, hasMore]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await userApi.getListFriends({
        pageIndex: 0,
        pageSize: 10,
      });
      if (response?.isSuccess && response.data) {
        setFriends(response.data.data);
      } else {
        message.error(response?.message || "Không thể tải danh sách bạn bè");
      }
    } catch {
      message.error("Lỗi khi tải danh sách bạn bè, vui lòng thử lại!");
    }
  }, []);

  useEffect(() => {
    if (!userId || initialLoadRef.current) return;

    const loadInitialData = async () => {
      try {
        await fetchProfile();
        await fetchPosts();
        initialLoadRef.current = true;
      } catch {
        message.error("Không thể tải dữ liệu ban đầu!");
      }
    };

    loadInitialData();
  }, [fetchProfile, fetchPosts, userId]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchPosts, hasMore, loading]);

  const handleAction = useCallback(
    async (apiEndpoint, method, successMessage, updateState) => {
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
                  followerCount:
                    updateState.followerCount ?? prev.followerCount,
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
      } catch {
        message.error("Lỗi hệ thống, vui lòng thử lại!");
      }
    },
    [userId]
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="relative w-full h-[400px] rounded-e-md">
        <img
          src={
            user?.userInfo?.profileBackgroundPictureUrl ||
            "https://fastly.picsum.photos/id/14/536/354.jpg?hmac=p8F6lcJ45rfP_j7N_J8IqhUE9-iUu1deD1BhGiLoV2Q"
          }
          alt="Ảnh bìa"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover rounded-b-md"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-28 relative z-10">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {isProfileLoading ? (
            <div className="flex justify-center py-10">
              <Spin size="large" />
            </div>
          ) : user ? (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between pb-4 mb-6">
                <div className="flex flex-col md:flex-row items-center">
                  <Avatar
                    size={140}
                    src={user.userInfo.profilePictureUrl}
                    className="border-4 border-white shadow-lg"
                  />
                  <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {user.userInfo.firstName} {user.userInfo.lastName}
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      @{user.userName} • {user.followerCount || 0} người theo
                      dõi
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {user.userInfo.bio || "Chưa có giới thiệu"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex space-x-3">
                  {!isWatching ? (
                    <Button
                      type="primary"
                      className="rounded-lg bg-blue-600 hover:bg-blue-700"
                      size="middle"
                      onClick={() => navigate("/edit-profile")}
                    >
                      Chỉnh sửa trang cá nhân
                    </Button>
                  ) : (
                    <>
                      <Button
                        type={relationship?.isFollowing ? "default" : "primary"}
                        className={`rounded-lg ${
                          relationship?.isFollowing
                            ? ""
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        size="middle"
                        onClick={() =>
                          handleAction(
                            relationship?.isFollowing
                              ? "/follow/unfollow"
                              : "/follow/follow",
                            "POST",
                            relationship?.isFollowing
                              ? "Đã hủy theo dõi"
                              : "Đã theo dõi",
                            {
                              isFollowing: !relationship?.isFollowing,
                              followerCount:
                                user.followerCount +
                                (relationship?.isFollowing ? -1 : 1),
                            }
                          )
                        }
                      >
                        {relationship?.isFollowing
                          ? "Hủy theo dõi"
                          : "Theo dõi"}
                      </Button>
                      {relationship?.isFriend ? (
                        <Dropdown
                          overlay={
                            <div className="bg-blue border rounded shadow-lg">
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleAction(
                                    "/friendship/unfriend",
                                    "DELETE",
                                    "Đã hủy kết bạn",
                                    { isFriend: false }
                                  )
                                }
                              >
                                Hủy kết bạn
                              </button>
                            </div>
                          }
                          trigger={["click"]}
                        >
                          <Button
                            type="primary"
                            className="rounded-lg"
                            size="middle"
                            color="blue"
                          >
                            Bạn bè
                          </Button>
                        </Dropdown>
                      ) : relationship?.isFriendRequest ? (
                        <Button
                          type="default"
                          className="rounded-lg"
                          size="middle"
                          onClick={() =>
                            handleAction(
                              "/friendship/delete-request",
                              "DELETE",
                              "Đã hủy lời mời kết bạn",
                              { isFriendRequest: false }
                            )
                          }
                        >
                          Hủy lời mời
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          className="rounded-lg"
                          size="middle"
                          onClick={() =>
                            handleAction(
                              "/friendship/add-friend",
                              "POST",
                              "Đã gửi lời mời kết bạn",
                              { isFriendRequest: true }
                            )
                          }
                        >
                          Thêm bạn
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <nav className="flex space-x-6 border-b pb-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`${
                      activeTab === "posts"
                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } pb-2 whitespace-nowrap`}
                  >
                    Bài viết
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("friends");
                      fetchFriends();
                    }}
                    className={`${
                      activeTab === "friends"
                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } pb-2 whitespace-nowrap`}
                  >
                    Bạn bè
                  </button>
                </nav>
              </div>

              <div className="space-y-6">
                {activeTab === "posts" ? (
                  posts.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg px-4">
                          <PostBox post={post} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 text-center">
                      Không có bài viết nào để hiển thị.
                    </p>
                  )
                ) : friends.length > 0 ? (
                  <div className="flex flex-col space-y-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="bg-white rounded-lg px-4 py-2"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar src={friend.profilePictureUrl} />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {friend.firstName} {friend.lastName}
                            </p>
                            <p className="text-gray-600 text-sm">
                              @{friend.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 text-center">
                    Không có bạn bè nào để hiển thị.
                  </p>
                )}
                <div ref={loadMoreRef} />
                {loading && posts.length > 0 && (
                  <div className="flex justify-center py-4">
                    <Spin size="large" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center py-10">
              <Skeleton avatar paragraph={{ rows: 4 }} active />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
