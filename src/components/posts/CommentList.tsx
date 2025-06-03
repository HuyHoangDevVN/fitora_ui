import { commentApi } from "@/api/commentApi";
import ReportModal from "@/components/common/ReportModal";
import { TargetType } from "@/enums/targetType";
import { CommentResponse } from "@/types/post";
import { Avatar, Button, Input, message, Modal, Spin, Tooltip } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { debounce } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";

dayjs.extend(relativeTime);

const CommentList: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [repliesByComment, setRepliesByComment] = useState<{
    [key: string]: { data: CommentResponse[]; nextCursor: string | null };
  }>({});
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{
    type: TargetType;
    id: string;
  } | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("x-client-id") || "current-user-id";
  const profile = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await commentApi.getCommentsByPost({
          postId,
          userId,
          limit: 10,
        });
        setComments(response.data.data);
        setNextCursor(response.data.nextCursor);
      } catch {
        message.error("Không thể tải bình luận!");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, userId]);

  const loadMoreComments = debounce(async () => {
    if (isFetching || !nextCursor) return;
    setIsFetching(true);
    try {
      const response = await commentApi.getCommentsByPost({
        postId,
        userId,
        cursor: nextCursor,
        limit: 10,
      });
      setComments((prev) => [...prev, ...response.data.data]);
      setNextCursor(response.data.nextCursor);
    } catch {
      message.error("Không thể tải thêm bình luận!");
    } finally {
      setIsFetching(false);
    }
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
      const response = await commentApi.createComment({
        postId,
        content: commentContent,
        mediaUrl: "",
      });
      setComments((prev) => [response.data, ...prev]);
      setCommentContent("");
      message.success("Đã thêm bình luận!");
    } catch {
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
      const response = await commentApi.createComment({
        postId,
        parentCommentId,
        content,
        mediaUrl: "",
      });
      response.data.user = profile;
      setRepliesByComment((prev) => ({
        ...prev,
        [parentCommentId]: {
          data: [response.data, ...(prev[parentCommentId]?.data || [])],
          nextCursor: prev[parentCommentId]?.nextCursor || null,
        },
      }));
      setReplyContent((prev) => ({ ...prev, [parentCommentId]: "" }));
      setReplyingTo(null);
      message.success("Đã thêm trả lời!");
    } catch {
      message.error("Không thể thêm trả lời!");
    }
  };

  const handleVote = async (commentId: string, newVoteType: 1 | 2 | 3) => {
    try {
      const response = await commentApi.voteComment({
        userId,
        commentId,
        voteType: newVoteType,
      });

      setComments((prev) => {
        const updatedComments = [...prev];
        const commentIndex = updatedComments.findIndex(
          (c) => c.id === commentId
        );
        if (commentIndex !== -1) {
          const comment = updatedComments[commentIndex];
          const currentVoteType = comment.userVoteType;
          const currentVotes = comment.votes ?? 0;

          const voteChanges: Record<string, number> = {
            "1->3": -1,
            "2->3": 1,
            "1->2": -2,
            "2->1": 2,
            "null->1": 1,
            "null->2": -1,
          };

          const key = `${currentVoteType ?? "null"}->${newVoteType}`;
          const updatedVotes = currentVotes + (voteChanges[key] || 0);

          updatedComments[commentIndex] = {
            ...comment,
            votes: updatedVotes,
            userVoteType: newVoteType === 3 ? null : newVoteType,
          };
        }
        return updatedComments;
      });

      message.success(
        newVoteType === 1
          ? "Upvote thành công!"
          : newVoteType === 2
          ? "Downvote thành công!"
          : "Bỏ phiếu thành công!"
      );
    } catch {
      message.error("Không thể vote bình luận!");
    }
  };

  const handleVoteReply = async (
    replyId: string,
    parentCommentId: string,
    newVoteType: 1 | 2 | 3
  ) => {
    try {
      const response = await commentApi.voteComment({
        userId,
        commentId: replyId,
        voteType: newVoteType,
      });

      setRepliesByComment((prev) => {
        const parentReplies = prev[parentCommentId];
        if (!parentReplies) return prev;

        const updatedReplies = parentReplies.data.map((reply) => {
          if (reply?.id === replyId) {
            const currentVoteType = reply?.userVoteType;
            const currentVotes = reply?.votes ?? 0;

            const voteChanges: Record<string, number> = {
              "1->3": -1,
              "2->3": 1,
              "1->2": -2,
              "2->1": 2,
              "null->1": 1,
              "null->2": -1,
            };

            const key = `${currentVoteType ?? "null"}->${newVoteType}`;
            const updatedVotes = currentVotes + (voteChanges[key] || 0);

            return {
              ...reply,
              votes: updatedVotes,
              userVoteType: newVoteType === 3 ? null : newVoteType,
            };
          }
          return reply;
        });

        return {
          ...prev,
          [parentCommentId]: {
            ...parentReplies,
            data: updatedReplies,
          },
        };
      });

      message.success(
        newVoteType === 1
          ? "Upvote thành công!"
          : newVoteType === 2
          ? "Downvote thành công!"
          : "Bỏ phiếu thành công!"
      );
    } catch {
      message.error("Không thể vote trả lời!");
    }
  };

  const handleShowReplies = async (commentId: string) => {
    if (repliesByComment[commentId]?.data?.length) return;

    try {
      const response = await commentApi.getCommentReplies({
        parentCommentId: commentId,
        userId,
        limit: 10,
      });
      setRepliesByComment((prev) => ({
        ...prev,
        [commentId]: {
          data: response.data.data,
          nextCursor: response.data.nextCursor,
        },
      }));
    } catch {
      message.error("Không thể tải phản hồi!");
    }
  };

  const handleDeleteComment = async (
    commentId: string,
    commentUserId: string
  ) => {
    if (commentUserId !== userId) {
      message.warning("Bạn không thể xóa bình luận của người khác!");
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa bình luận",
      content: "Bạn có chắc chắn muốn xóa bình luận này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await commentApi.deleteComment(commentId);
          setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId)
          );
          message.success("Đã xóa bình luận!");
        } catch {
          message.error("Không thể xóa bình luận!");
        }
      },
    });
  };

  // Helper: Build a tree from flat comments array
  function buildCommentTree(
    comments: CommentResponse[]
  ): (CommentResponse & { children: CommentResponse[] })[] {
    const map: Record<
      string,
      CommentResponse & { children: CommentResponse[] }
    > = {};
    const roots: (CommentResponse & { children: CommentResponse[] })[] = [];
    comments.forEach((c) => {
      map[c.id] = { ...c, children: [] };
    });
    comments.forEach((c) => {
      if (c.parentCommentId && map[c.parentCommentId]) {
        map[c.parentCommentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  }

  const renderCommentTree = (comment, depth = 0) => (
    <div
      key={comment.id}
      className={depth > 0 ? `pl-${Math.min(depth * 4, 24)}` : ""}
    >
      <div className="flex items-start gap-3 mb-2">
        <Avatar
          src={comment.user?.profilePictureUrl || "https://i.pravatar.cc/40"}
          alt={comment.user?.username}
          size={40}
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3 shadow-sm relative">
            <span className="font-semibold text-gray-800">
              {comment.user?.username || comment.author}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              {dayjs(comment.createdAt).fromNow()}
            </span>
            <p className="mt-1 text-gray-700">{comment.content}</p>
            {/* Xóa bình luận nếu là của mình */}
            {comment.user?.id === userId && (
              <Button
                type="text"
                className="absolute right-0 top-1 p-1"
                onClick={() => handleDeleteComment(comment.id, comment.user.id)}
              >
                <MdClear />
              </Button>
            )}
          </div>
          {/* Vote actions */}
          <div className="flex items-center gap-2 mt-1">
            <Button
              type="text"
              className={`$ {
                comment?.userVoteType === 1
                  ? "text-primary"
                  : "text-gray-400 hover:text-primary"
              } hover:text-primary`}
              icon={<PiArrowFatUpLight className="text-xl" />}
              onClick={() =>
                handleVote(comment.id, comment.userVoteType === 1 ? 3 : 1)
              }
            />
            <span className="text-sm font-semibold text-gray-600">
              {comment?.votes ?? 0}
            </span>
            <Button
              type="text"
              className={`$ {
                comment?.userVoteType === 2
                  ? "text-primary"
                  : "text-gray-400 hover:text-primary"
              } hover:text-primary`}
              icon={<PiArrowFatDownLight className="text-xl" />}
              onClick={() =>
                handleVote(comment.id, comment.userVoteType === 2 ? 3 : 2)
              }
            />
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
          {/* Reply input */}
          {replyingTo === comment.id && (
            <div className="flex items-center gap-2 mt-2">
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
                className="rounded-md border-gray-300 focus:border-primary focus:ring-primary"
              />
              <Tooltip title="Gửi trả lời" placement="top">
                <Button
                  type="primary"
                  className="rounded-md bg-primary"
                  onClick={() => handleAddReply(comment.id)}
                >
                  <IoSendSharp />
                </Button>
              </Tooltip>
            </div>
          )}
          {/* Hiển thị replies nếu có children */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-2">
              {comment.children.map((child) => (
                <div key={child.id}>
                  {/* Vote actions for reply */}
                  {renderCommentTree(child, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-4 px-4">
      <div className="flex items-center gap-2 mb-4">
        <Input.TextArea
          rows={1}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Viết bình luận..."
          className="rounded-md flex-1 border-gray-300 focus:border-primary focus:ring-primary"
        />
        <Tooltip title="Gửi bình luận" placement="top">
          <Button
            type="primary"
            className="rounded-md bg-primary"
            onClick={handleAddComment}
          >
            <IoSendSharp />
          </Button>
        </Tooltip>
      </div>

      {loading && comments.length === 0 ? (
        <div className="flex justify-center mt-4">
          <Spin />
        </div>
      ) : (
        <div>
          {buildCommentTree(comments).map((comment) =>
            renderCommentTree(comment)
          )}
        </div>
      )}

      {loading && comments.length > 0 && (
        <div className="flex justify-center mt-4">
          <Spin />
        </div>
      )}
      <div ref={sentinelRef} style={{ height: "1px" }} />
      <ReportModal
        open={isReportModalOpen}
        onCancel={() => {
          setIsReportModalOpen(false);
          setReportTarget(null);
        }}
        targetType={reportTarget?.type as TargetType}
        targetId={reportTarget?.id || ""}
      />
    </div>
  );
};

export default CommentList;
