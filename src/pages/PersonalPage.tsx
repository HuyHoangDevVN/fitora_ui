import { interactRepository, userRepository } from "@/_base/const/Repository";
import PostBox from "@/components/Home/PostBox";
import { PaginatedCursorResult } from "@/interfaces/PaginatedCrusorResult";
import { Post } from "@/interfaces/Post";
import { ProfileUser } from "@/interfaces/ProfileUser";
import { ResponseBase } from "@/interfaces/ResponseBase";
import { Avatar, Button, message, Skeleton, Spin } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const PersonalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isWatching, userId } = location.state || {};

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [relationship, setRelationship] = useState({
    isFriend: false,
    isFriendRequest: false,
    isFollowing: false,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef<boolean>(false);

  const fetchProfile = useCallback(async () => {
    try {
      const url =
        isWatching && userId
          ? `/user/get-user?GetId=${userId}`
          : `/user/profile`;
      const response = await userRepository.get<ResponseBase<ProfileUser>>(url);
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
      message.error("Lỗi khi tải hồ sơ, vui lòng thử lại!");
    }
  }, [isWatching, userId]);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      let url =
        isWatching && userId
          ? `/post/personal?Id=${userId}&Limit=4`
          : `/post/personal?Limit=4`;
      if (nextCursor) {
        url += `&Cursor=${nextCursor}`;
      }
      const response = await interactRepository.get<
        ResponseBase<PaginatedCursorResult<Post>>
      >(url);
      if (response?.isSuccess && response.data) {
        setPosts((prev) => {
          const newPosts = response.data.data.filter(
            (post) => !prev.some((p) => p.id === post.id)
          );
          return [...prev, ...newPosts];
        });
        setNextCursor(response.data.nextCursor);
        setHasMore(response.data.nextCursor !== null);
      } else {
        message.error(response?.message || "Không thể tải bài viết");
      }
    } catch (error) {
      message.error("Lỗi khi tải bài viết, vui lòng thử lại!");
    } finally {
      setLoading(false);
      if (initialLoadRef.current === false) setInitialLoading(false);
    }
  }, [isWatching, userId, nextCursor, loading, hasMore]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      Promise.all([fetchProfile(), fetchPosts()])
        .then(() => {
          initialLoadRef.current = true;
        })
        .catch(() => {
          setInitialLoading(false);
          message.error("Không thể tải dữ liệu ban đầu!");
        });
    }
  }, [fetchProfile, fetchPosts]);

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
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchPosts, hasMore, loading]);

  const handleAction = useCallback(
    async (
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
      } catch (error) {
        message.error("Lỗi hệ thống, vui lòng thử lại!");
      }
    },
    [userId]
  );

  const renderPost = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <div style={style} className="p-2">
      <PostBox post={posts[index]} />
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="relative w-full h-[350px]">
        <img
          src={
            user?.userInfo?.profileBackgroundPictureUrl ||
            "https://fastly.picsum.photos/id/14/536/354.jpg?hmac=p8F6lcJ45rfP_j7N_J8IqhUE9-iUu1deD1BhGiLoV2Q"
          }
          alt="Ảnh bìa"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover rounded-b-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10 rounded-b-lg"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          {initialLoading ? (
            <div className="flex justify-center py-10">
              <Skeleton avatar paragraph={{ rows: 4 }} active />
            </div>
          ) : user ? (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between border-b pb-4 mb-6">
                <div className="flex flex-col md:flex-row items-center">
                  <Avatar
                    size={120}
                    src={user.userInfo.profilePictureUrl}
                    className="border-4 border-white shadow-xl"
                  />
                  <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <h1 className="text-2xl font-semibold text-gray-800">
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
                        type={relationship.isFollowing ? "default" : "primary"}
                        className={`rounded-lg ${
                          relationship.isFollowing
                            ? ""
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        size="large"
                        onClick={() =>
                          handleAction(
                            relationship.isFollowing
                              ? "/follow/unfollow"
                              : "/follow/follow",
                            "POST",
                            relationship.isFollowing
                              ? "Đã hủy theo dõi"
                              : "Đã theo dõi",
                            {
                              isFollowing: !relationship.isFollowing,
                              followerCount:
                                user.followerCount +
                                (relationship.isFollowing ? -1 : 1),
                            }
                          )
                        }
                      >
                        {relationship.isFollowing ? "Hủy theo dõi" : "Theo dõi"}
                      </Button>
                      <Button
                        type="default"
                        className="rounded-lg"
                        size="large"
                        onClick={() =>
                          handleAction(
                            "/friendship/add-friend",
                            "POST",
                            "Đã gửi lời mời kết bạn",
                            { isFriendRequest: true }
                          )
                        }
                        disabled={
                          relationship.isFriend || relationship.isFriendRequest
                        }
                      >
                        {relationship.isFriend
                          ? "Bạn bè"
                          : relationship.isFriendRequest
                          ? "Đã gửi"
                          : "Thêm bạn"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <nav className="flex space-x-6 border-b pb-2 overflow-x-auto">
                  <a
                    href="#"
                    className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-2 whitespace-nowrap"
                  >
                    Bài viết
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 pb-2 whitespace-nowrap"
                  >
                    Giới thiệu
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 pb-2 whitespace-nowrap"
                  >
                    Bạn bè
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 pb-2 whitespace-nowrap"
                  >
                    Ảnh
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 pb-2 whitespace-nowrap"
                  >
                    Video
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 pb-2 whitespace-nowrap"
                  >
                    Reels
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-600 pb-2 whitespace-nowrap"
                  >
                    Xem thêm
                  </a>
                </nav>
              </div>

              <div className="space-y-0" style={{ height: "500px" }}>
                {posts.length > 0 ? (
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        height={height}
                        itemCount={posts.length}
                        itemSize={200}
                        width={width}
                      >
                        {renderPost}
                      </List>
                    )}
                  </AutoSizer>
                ) : (
                  <p className="text-gray-700 text-center">
                    Không có bài viết nào để hiển thị.
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

export default PersonalPage;
