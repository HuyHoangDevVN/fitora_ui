import { postApi } from "@/api/postApi";
import { userApi } from "@/api/userApi";
import PostBox from "@/components/posts/PostBox";
import { useCategoriesForNewfeed } from "@/features/category/categorySlice";
import colors from "@/styles/colors";
import { Post } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Badge, Button, Divider, message, Skeleton, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FaFire, FaHeart, FaHome } from "react-icons/fa";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data: categoryData } = useCategoriesForNewfeed();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["posts", activeTab],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      postApi
        .fetchPosts({
          feedType: activeTab === "all" ? 1 : 2,
          categoryId: activeTab && activeTab !== "all" ? activeTab : undefined,
          cursor: pageParam,
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  useEffect(() => {
    userApi.fetchUserProfile();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

        {categoryData?.followed?.map((category) => (
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

        {categoryData?.trending
          ?.filter(
            (category) =>
              !categoryData.followed.some(
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
                    zIndex: 20,
                  }}
                />
              )}
            </Button>
          ))}
      </div>

      {isLoading && !data ? (
        <Spin
          tip="Đang tải bài viết..."
          className="w-full flex justify-center"
        />
      ) : (
        data?.pages.map((page) =>
          page.data.map((post: Post) => (
            <div key={post.id} className="relative">
              <PostBox post={post} />
              <Divider
                style={{ borderColor: colors.border, margin: "15px 0" }}
              />
            </div>
          ))
        )
      )}

      {isFetchingNextPage && (
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
