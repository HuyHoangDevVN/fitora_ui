import { postApi } from "@/api/postApi";
import PostBox from "@/components/posts/PostBox";
import colors from "@/styles/colors";
import { Post } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Divider, message, Skeleton, Spin } from "antd";
import React, { useEffect, useRef } from "react";

const Saved: React.FC = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["savedPosts"],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      postApi
        .fetchSavedPosts({
          cursor: pageParam,
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (error) {
      message.error("Có lỗi xảy ra khi tải bài viết đã lưu!");
    }
  }, [error]);

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
      <h1 className="text-xl font-bold mb-4">Bài viết đã lưu</h1>

      {isLoading && !data ? (
        <Spin
          tip="Đang tải bài viết đã lưu..."
          className="w-full flex justify-center"
        />
      ) : (
        data?.pages.map((page) =>
          page.data.map((post: Post) => (
            <div key={post.id} className="relative">
              <PostBox post={post} isSaved={true} />
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

export default Saved;
