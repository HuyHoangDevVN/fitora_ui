import { postApi } from "@/api/postApi";
import PostBox from "@/components/posts/PostBox";
import colors from "@/styles/colors";
import { Post } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Divider, Skeleton, Spin } from "antd";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const PostSearch: React.FC = () => {
  const { keySearch } = useParams();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<{ data: Post[]; nextCursor: string | null }, Error>({
      queryKey: ["search-posts", keySearch],
      queryFn: async ({ pageParam = undefined, queryKey }) => {
        const [, keySearchParam] = queryKey as [string, string];
        return postApi
          .fetchPosts({
            feedType: 1,
            keySearch: keySearchParam ? encodeURIComponent(keySearchParam) : "",
            cursor: pageParam as string | undefined,
          })
          .then((res) => res.data);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined,
    });

  // Reset scroll when keySearch changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo?.(0, 0);
    }
  }, [keySearch]);

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
    <div ref={containerRef} className="max-w-2xl mx-auto px-2 md:px-0">
      {keySearch === undefined || keySearch === null ? (
        <div className="my-10 text-center text-gray-500">
          Vui lòng nhập từ khóa tìm kiếm.
        </div>
      ) : isLoading && !data ? (
        <Spin
          tip="Đang tìm kiếm bài viết..."
          className="w-full flex justify-center"
        />
      ) : data?.pages.every(
          (page) => (page as { data: Post[] }).data.length === 0
        ) ? (
        <div className="my-10 text-center text-gray-500">
          Không tìm thấy bài viết nào.
        </div>
      ) : (
        data?.pages.map((page) =>
          (page as { data: Post[] }).data.map((post: Post) => (
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
