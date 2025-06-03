import { postApi } from "@/api/postApi";
import PostBox from "@/components/posts/PostBox";
import colors from "@/styles/colors";
import { Post } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Divider, Skeleton, Spin, Input, Empty } from "antd";
import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PostSearch: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keySearchParam = params.get("query") || "";
  const [searchValue, setSearchValue] = useState(keySearchParam);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search-posts", searchValue],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      postApi
        .fetchPosts({
          feedType: 1,
          keySearch: searchValue,
          cursor: pageParam,
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    enabled: !!searchValue,
  });

  useEffect(() => {
    setSearchValue(keySearchParam);
  }, [keySearchParam]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="max-w-2xl mx-auto px-2 md:px-0">
      <div className="flex items-center gap-2 mb-6 mt-4">
        <Input.Search
          placeholder="Tìm kiếm bài viết..."
          value={searchValue}
          onChange={handleInputChange}
          onSearch={handleSearch}
          allowClear
          enterButton
          size="large"
          className="flex-1"
        />
      </div>
      {isLoading && !data ? (
        <Spin
          tip="Đang tìm kiếm bài viết..."
          className="w-full flex justify-center"
        />
      ) : data?.pages.every((page) => page.data.length === 0) ? (
        <Empty description="Không tìm thấy bài viết nào." className="my-10" />
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
