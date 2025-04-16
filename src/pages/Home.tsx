import PostBox from "@/components/posts/PostBox";
import colors from "@/styles/colors";
import { Badge, Button, Divider, message, Skeleton, Spin } from "antd";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesForNewfeed } from "@/features/category/categorySlice";
import { fetchPosts, resetPosts } from "@/features/posts/postsSlice";
import { fetchUserProfile } from "@/features/users/userSlice";
import { RootState } from "@/store/store";
import { Post } from "@/types/post";
import { FaFire, FaHeart, FaHome } from "react-icons/fa";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, status, error, nextCursor, hasMore, errorCount } = useSelector(
    (state: RootState) => state.posts
  );
  const { categoriesForNewfeed, followedCategories } = useSelector(
    (state: RootState) => state.category
  );

  const [activeTab, setActiveTab] = useState<string | null>("all");

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef<boolean>(false);

  const debouncedLoadPosts = debounce(() => {
    if (
      status === "loading" ||
      !hasMore ||
      isFetchingRef.current ||
      errorCount >= 3
    )
      return;

    isFetchingRef.current = true;
    dispatch(
      fetchPosts({
        feedType: activeTab === "all" ? 1 : 2,
        categoryId: activeTab && activeTab !== "all" ? activeTab : undefined,
        cursor: nextCursor,
      }) as any
    )
      .unwrap()
      .catch((err) => {
        message.error(err || "Có lỗi xảy ra khi tải bài viết!");
      })
      .finally(() => {
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 500);
      });
  }, 300);

  const loadPosts = useCallback(() => {
    debouncedLoadPosts();
  }, [debouncedLoadPosts]);

  useEffect(() => {
    dispatch(resetPosts());
    loadPosts();
  }, [activeTab, dispatch]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          status !== "loading" &&
          !isFetchingRef.current
        ) {
          loadPosts();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadPosts, hasMore, status]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    dispatch(fetchCategoriesForNewfeed() as any);
    dispatch(fetchUserProfile() as any);
  }, [dispatch]);

  const PostSkeleton = () => (
    <div style={{ padding: "15px 0" }}>
      <div className="flex gap-3">
        <Skeleton.Avatar active size={40} shape="circle" />
        <div style={{ flex: 1 }}>
          <Skeleton.Input
            active
            style={{ width: "200px", height: "16px", marginBottom: "8px" }}
          />
          <Skeleton paragraph={{ rows: 2, width: ["100%", "80%"] }} />
        </div>
      </div>
      <Divider style={{ borderColor: colors.border, margin: "15px 0" }} />
    </div>
  );

  return (
    <div>
      <div className="tab-newfeed flex flex-row gap-3 mb-4 whitespace-nowrap px-4 md:px-0">
        <Button
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer flex items-center h-10 ${
            activeTab === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105"
          }`}
          onClick={() => setActiveTab("all")}
        >
          <FaHome className="mr-0 w-4 h-4" />
          Home
        </Button>

        {followedCategories?.map((category) => (
          <Button
            key={category.id}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer h-10 ${
              activeTab === category.id
                ? "bg-primary text-white border-red-600"
                : "bg-white text-primary hover:bg-gray-200 hover:scale-105 border border-red-400"
            }`}
            onClick={() => setActiveTab(category.id)}
          >
            <FaHeart className="mr-0 w-4 h-4" />
            {category.name}
          </Button>
        ))}

        {categoriesForNewfeed
          ?.filter(
            (category) =>
              !followedCategories.some(
                (followed) => followed.id === category.id
              )
          )
          .map((category, index) => (
            <Button
              key={category.id}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer h-10 ${
                activeTab === category.id
                  ? "bg-primary text-white border-orange-600"
                  : "bg-white text-orange-400 hover:bg-gray-200 hover:scale-105 border border-orange-400"
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              <div className="flex items-center">
                <FaFire className="mr-2 w-4 h-4" />
                {category.name}
              </div>
              {activeTab !== category.id && index === 0 && (
                <Badge
                  count="Trending"
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    position: "absolute",
                    top: "-15px",
                    right: "-20px",
                    transform: "translate(50%, -50%)",
                    borderRadius: "12px",
                    padding: "0 8px",
                    boxShadow: "0 0 0 1px #d9d9d9",
                    zIndex: 100,
                  }}
                />
              )}
            </Button>
          ))}
      </div>

      {status === "loading" && posts.length === 0 ? (
        <div className="w-full flex justify-center gap-2">
          <Spin spinning={true}></Spin>
          <div>Đang tải bài viết...</div>
        </div>
      ) : (
        posts?.map((post: Post) => (
          <div key={post.id} className="relative">
            <PostBox post={post} />
            <Divider style={{ borderColor: colors.border, margin: "15px 0" }} />
          </div>
        ))
      )}

      {status === "loading" && posts.length > 0 && (
        <div style={{ padding: "20px 0" }}>
          {Array(2)
            ?.fill(0)
            .map((_, index) => (
              <PostSkeleton key={index} />
            ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: "1px" }} />
    </div>
  );
};

export default Home;
