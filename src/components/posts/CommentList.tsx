import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Avatar, Button, Input, Spin, message } from "antd";
import {
  fetchCommentsByPost,
  createComment,
  voteComment,
  fetchCommentReplies,
} from "@/features/comments/commentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { debounce } from "lodash";
import { PiArrowFatUpLight, PiArrowFatDownLight } from "react-icons/pi";
import { CommentResponse } from "@/types/post";
import { IoSendSharp } from "react-icons/io5";

const CommentList: React.FC<{ postId: string }> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { commentsByPost, repliesByComment, loading } = useSelector(
    (state: RootState) => state.comment
  );
  const comments = commentsByPost[postId]?.data || [];
  const nextCursor = commentsByPost[postId]?.nextCursor || null;
  const [isFetching, setIsFetching] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("x-client-id") || "current-user-id"; // Thay bằng logic lấy userId thực tế
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  ); // Lưu nội dung trả lời cho từng bình luận
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // ID của bình luận đang trả lời

  // Lấy danh sách bình luận khi component mount
  useEffect(() => {
    dispatch(fetchCommentsByPost({ postId, userId, limit: 10 }));
  }, [dispatch, postId, userId]);

  // Tải thêm bình luận khi cuộn đến cuối danh sách
  const loadMoreComments = debounce(() => {
    if (isFetching || !nextCursor) return;
    setIsFetching(true);
    dispatch(
      fetchCommentsByPost({
        postId,
        userId,
        cursor: String(nextCursor),
        limit: 10,
      })
    )
      .unwrap()
      .catch(() => message.error("Không thể tải thêm bình luận!"))
      .finally(() => setIsFetching(false));
  }, 300);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isFetching) {
          loadMoreComments();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMoreComments, nextCursor, isFetching]);

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }
    try {
      await dispatch(
        createComment({ postId, content: commentContent, mediaUrl: "" })
      ).unwrap();
      setCommentContent("");
      message.success("Đã thêm bình luận!");
    } catch (error) {
      message.error("Không thể thêm bình luận!");
    }
  };

  const handleAddReply = async (parentCommentId: string) => {
    const content = replyContent[parentCommentId]?.trim();
    if (!content) {
      message.warning("Vui lòng nhập nội dung trả lời!");
      return;
    }
    try {
      await dispatch(
        createComment({
          postId,
          parentCommentId,
          content,
          mediaUrl: "",
        })
      ).unwrap();
      setReplyContent((prev) => ({ ...prev, [parentCommentId]: "" }));
      setReplyingTo(null);
      message.success("Đã thêm trả lời!");
    } catch (error) {
      message.error("Không thể thêm trả lời!");
    }
  };

  const handleVote = async (commentId: string, voteType: 1 | 2 | 3) => {
    try {
      await dispatch(
        voteComment({ userId, commentId, voteType: voteType })
      ).unwrap();
      message.success(
        `Đã ${voteType === 1 ? "thích" : "không thích"} bình luận!`
      );
    } catch (error) {
      message.error("Không thể vote bình luận!");
    }
  };

  const handleShowReplies = (commentId: string) => {
    if (!repliesByComment[commentId]?.data?.length) {
      dispatch(
        fetchCommentReplies({ parentCommentId: commentId, userId, limit: 10 })
      );
    }
  };

  return (
    <div className="mt-4 px-4">
      {/* Form thêm bình luận */}
      <div className="flex items-center gap-2 mb-4">
        <Input.TextArea
          rows={1}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Viết bình luận..."
          className="rounded-md flex-1 border-gray-300 focus:border-primary focus:ring-primary"
        />
        <Button
          type="primary"
          className="rounded-md"
          onClick={handleAddComment}
        >
          <IoSendSharp />
        </Button>
      </div>

      {/* Danh sách bình luận */}
      <List
        dataSource={comments}
        loading={loading && comments.length === 0}
        renderItem={(comment: CommentResponse) => (
          <div key={comment.id} className="mb-6">
            <div className="flex items-start gap-3">
              <Avatar
                src={
                  comment.user.profilePictureUrl || "https://i.pravatar.cc/40"
                }
                alt={comment.user.username}
                size={40}
              />
              <div className="flex-1">
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-800">
                    {comment.user.username}
                  </span>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Button
                      type="text"
                      icon={
                        <PiArrowFatUpLight
                          className={`text-xl ${
                            comment.userVoteType === 1
                              ? "text-primary"
                              : "text-gray-400 hover:text-primary"
                          }`}
                        />
                      }
                      onClick={() =>
                        handleVote(
                          comment.id,
                          comment.userVoteType === 1 ? 3 : 1
                        )
                      }
                    />
                    <span className="text-sm font-semibold text-gray-600">
                      {comment.votes}
                    </span>
                    <Button
                      type="text"
                      icon={
                        <PiArrowFatDownLight
                          className={`text-xl ${
                            comment.userVoteType === 2
                              ? "text-primary"
                              : "text-gray-400 hover:text-primary"
                          }`}
                        />
                      }
                      onClick={() =>
                        handleVote(
                          comment.id,
                          comment.userVoteType === 2 ? 3 : 2
                        )
                      }
                    />
                  </div>
                  <Button
                    type="link"
                    className="p-0 text-gray-500 hover:text-blue-500"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    Phản hồi
                  </Button>
                  {comment.replyCount > 0 && (
                    <Button
                      type="link"
                      className="p-0 text-gray-500 hover:text-blue-500"
                      onClick={() => handleShowReplies(comment.id)}
                    >
                      Xem {comment.replyCount} phản hồi
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Form trả lời */}
            {replyingTo === comment.id && (
              <div className="flex items-center gap-2 ml-12 mt-2">
                <Input.TextArea
                  rows={1}
                  value={replyContent[comment.id] || ""}
                  onChange={(e) =>
                    setReplyContent((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                  placeholder="Viết trả lời..."
                  className="rounded-md  border-gray-300 focus:border-primary focus:ring-primary"
                />
                <Button
                  type="primary"
                  className="rounded-md"
                  onClick={() => handleAddReply(comment.id)}
                >
                  <IoSendSharp />
                </Button>
              </div>
            )}

            {/* Danh sách phản hồi */}
            {repliesByComment[comment.id]?.data?.length > 0 && (
              <div className=" ml-12 mt-2">
                <List
                  dataSource={repliesByComment[comment.id].data}
                  renderItem={(reply: CommentResponse) => (
                    <div key={reply.id} className="mb-2">
                      <div className="flex items-start gap-3">
                        <Avatar
                          src={
                            reply.user.profilePictureUrl ||
                            "https://i.pravatar.cc/40"
                          }
                          alt={reply.user.username}
                          size={32}
                        />
                        <div className="flex-1">
                          <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                            <span className="font-semibold text-gray-800">
                              {reply.user.username}
                            </span>
                            <p className="mt-1 text-gray-700">
                              {reply.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Button
                                type="text"
                                icon={
                                  <PiArrowFatUpLight
                                    className={`text-xl ${
                                      reply.userVoteType === 1
                                        ? "text-primary"
                                        : "text-gray-400 hover:text-primary"
                                    }`}
                                  />
                                }
                                onClick={() =>
                                  handleVote(
                                    reply.id,
                                    reply.userVoteType === 1 ? 3 : 1
                                  )
                                }
                              />
                              <span className="text-sm font-semibold text-gray-600">
                                {reply.votes}
                              </span>
                              <Button
                                type="text"
                                icon={
                                  <PiArrowFatDownLight
                                    className={`text-xl ${
                                      reply.userVoteType === 2
                                        ? "text-primary"
                                        : "text-gray-400 hover:text-primary"
                                    }`}
                                  />
                                }
                                onClick={() =>
                                  handleVote(
                                    reply.id,
                                    reply.userVoteType === 2 ? 3 : 2
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        )}
      />

      {/* Sentinel để tải thêm bình luận */}
      {loading && comments.length > 0 && (
        <div className="flex justify-center mt-4">
          <Spin />
        </div>
      )}
      <div ref={sentinelRef} style={{ height: "1px" }} />
    </div>
  );
};

export default CommentList;
