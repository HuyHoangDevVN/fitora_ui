import { postApi } from "@/api/postApi";
import PostBox from "@/components/posts/PostBox";
import colors from "@/styles/colors";
import { Post } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Divider, Empty, Skeleton, Spin } from "antd";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const PostSearch: React.FC = () => {
  const { keySearch } = useParams();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["search-posts", keySearch],
      queryFn: ({ pageParam }: { pageParam?: string }) =>
        postApi
          .fetchPosts({
            feedType: 1,
            keySearch,
            cursor: pageParam,
          })
          .then((res) => res.data),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined,
      enabled: !!keySearch,
    });

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
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
    <div className="max-w-2xl mx-auto px-2 md:px-0">
      {isLoading && !data ? (
        <Spin
          tip="Đang tìm kiếm bài viết..."
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
            .fill(0)
            .map((_, index) => (
              <PostSkeleton key={index} />
            ))}
        </div>
      )}
      <div ref={sentinelRef} style={{ height: "1px" }} />
    </div>
  );
};

export default PostSearch;
