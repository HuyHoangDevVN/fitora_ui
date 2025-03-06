import { interactRepository } from "@/_base/const/Repository";
import PostBox from "@/components/Home/PostBox";
import { Post } from "@/interfaces/Post";
import colors from "@/styles/colors";
import { Divider, message, Skeleton } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

const LIMIT = 4;

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const nextCursorRef = useRef<number | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const fetchPosts = useCallback(
    debounce(async () => {
      if (loading || !hasMore || isFetchingRef.current || errorCount >= 3)
        return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const url = `/post/newfeed?Limit=${LIMIT}${
          nextCursorRef.current !== null
            ? `&Cursor=${nextCursorRef.current}`
            : ""
        }`;

        const response = await interactRepository.get(url);

        if (response?.isSuccess && response.data) {
          const newPosts = response.data.data.filter(
            (post: Post) => !posts.some((p) => p.id === post.id)
          );

          setPosts((prev) => [...prev, ...newPosts]);
          nextCursorRef.current = response.data.nextCursor;
          setHasMore(response.data.nextCursor !== null);
          setErrorCount(0);
        } else {
          throw new Error(response?.message || "Không thể tải bài viết");
        }
      } catch (error) {
        setErrorCount((prev) => prev + 1);
        message.error(
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tải bài viết!"
        );
        if (errorCount + 1 >= 3) {
          setHasMore(false);
          message.error("Đã xảy ra quá nhiều lỗi, vui lòng thử lại sau!");
        }
      } finally {
        setLoading(false);
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 500);
      }
    }, 300),
    [loading, hasMore, posts, errorCount]
  );

  useEffect(() => {
    fetchPosts();
    return () => {
      fetchPosts.cancel();
    };
  }, [fetchPosts]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !isFetchingRef.current
        ) {
          fetchPosts();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchPosts, hasMore, loading]);

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
      {posts.map((post) => (
        <div key={post.id}>
          <PostBox post={post} />
          <Divider style={{ borderColor: colors.border, margin: "15px 0" }} />
        </div>
      ))}
      {loading && (
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

export default Home;
