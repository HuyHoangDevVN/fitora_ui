import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { Divider, message, Skeleton } from "antd";
import PostBox from "@/components/posts/PostBox";
import colors from "@/styles/colors";

import { Post } from "@/types/post";
import { RootState } from "@/store/store";
import { fetchPosts } from "@/features/posts/postsSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, status, error, nextCursor, hasMore, errorCount } = useSelector(
    (state: RootState) => state.posts
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef<boolean>(false);

  const loadPosts = useCallback(
    debounce(() => {
      if (
        status === "loading" ||
        !hasMore ||
        isFetchingRef.current ||
        errorCount >= 3
      )
        return;

      isFetchingRef.current = true;
      dispatch(fetchPosts(nextCursor) as any)
        .unwrap()
        .catch((err) => {
          message.error(err || "Có lỗi xảy ra khi tải bài viết!");
        })
        .finally(() => {
          setTimeout(() => {
            isFetchingRef.current = false;
          }, 500);
        });
    }, 300),
    [dispatch, status, hasMore, nextCursor, errorCount]
  );

  useEffect(() => {
    if (status === "idle") {
      loadPosts();
    }
    return () => {
      loadPosts.cancel();
    };
  }, [status, loadPosts]);

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
      {posts?.map((post: Post) => (
        <div key={post.id}>
          <PostBox post={post} />
          <Divider style={{ borderColor: colors.border, margin: "15px 0" }} />
        </div>
      ))}

      {status === "loading" && (
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
