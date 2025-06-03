import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Form,
  Image,
  Input,
  message,
  Modal,
  Skeleton,
  Space,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { FaLock, FaRegComment, FaUserFriends } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { RiShareForwardLine } from "react-icons/ri";

import { categoryApi } from "@/api/categoryApi";
import { postApi } from "@/api/postApi";
import { interactRepository } from "@/api/repository";
import ReportModal from "@/components/common/ReportModal";
import { PrivacyPost } from "@/enums/post";
import { TargetType } from "@/enums/targetType";
import { votePost } from "@/features/posts/postsSlice";
import { AppDispatch } from "@/store/store";
import { Post } from "@/types/post";
import { timeToLast } from "@/utils/FunctionHelpper";
import { IoEarthSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommentList from "./CommentList";

const DEFAULT_AVATAR = "https://i.pravatar.cc/40";
const MEDIA_TYPES = {
  IMAGE: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
  VIDEO: ["mp4", "webm", "ogg"],
  AUDIO: ["mp3", "wav", "ogg"],
  PDF: ["pdf"],
};

const getFileType = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return "other";
  if (MEDIA_TYPES.IMAGE.includes(extension)) return "image";
  if (MEDIA_TYPES.VIDEO.includes(extension)) return "video";
  if (MEDIA_TYPES.AUDIO.includes(extension)) return "audio";
  if (MEDIA_TYPES.PDF.includes(extension)) return "pdf";
  return "other";
};

type PostBoxProps = { post: Post; isSaved?: boolean };
const RIBBON_COLORS = ["#FF4770", "#FF914D", "#FFC107", "#4CAF50", "#2196F3"];

const PostBox: React.FC<PostBoxProps> = React.memo(({ post, isSaved }) => {
  const randomRibbonColor = useMemo(
    () => RIBBON_COLORS[Math.floor(Math.random() * RIBBON_COLORS.length)],
    []
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState(post?.content);
  const [editMediaUrl, setEditMediaUrl] = useState(post?.mediaUrl);
  const [loading, setLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [_isFollowing] = useState(post?.user?.isFollowing);
  const [numberOfVotes, setNumberOfVotes] = useState(post?.votesCount);
  const [voteType, setVoteType] = useState<1 | 2 | null>(post?.userVoteType);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<TargetType | null>(null);

  const avatarSrc = useMemo(
    () => post?.user?.profilePictureUrl || DEFAULT_AVATAR,
    [post?.user?.profilePictureUrl]
  );
  const isMe = useMemo(
    () => post?.user?.id === localStorage.getItem("x-client-id"),
    [post?.user?.id]
  );

  const toggleEditModal = useCallback(
    (visible: boolean) => setIsEditModalVisible(visible),
    []
  );

  const handleEditOk = useCallback(async () => {
    setLoading(true);
    try {
      await interactRepository.put(`/post/update-post/${post?.id}`, {
        content: editContent,
        mediaUrl: editMediaUrl,
        privacy: post?.privacy,
      });
      toggleEditModal(false);
      message.success("Cập nhật bài viết thành công");
    } catch (_error) {
      console.error("Error updating post:", _error);
      message.error("Cập nhật bài viết thất bại");
    } finally {
      setLoading(false);
    }
  }, [editContent, editMediaUrl, post?.id, post?.privacy, toggleEditModal]);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: "Xóa bài viết",
      content: "Bạn có chắc muốn xóa bài viết này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          await interactRepository.delete(`/post/delete-post/${post?.id}`);
          message.success("Xóa bài viết thành công");
        } catch (_error) {
          console.error("Error deleting post:", _error);
          message.error("Xóa bài viết thất bại");
        } finally {
          setLoading(false);
        }
      },
    });
  }, [post?.id]);
  const menuItems = useMemo(
    () =>
      [
        isMe && { key: "edit", label: "Chỉnh sửa" },
        isMe && { key: "delete", label: "Xoá bài viết" },
        !post?.isCategoryFollowed && {
          key: "followCategory",
          label: "Theo dõi danh mục",
        },
        !isSaved && { key: "save", label: "Lưu bài viết" },
        isSaved && { key: "unsave", label: "Bỏ lưu bài viết" },
        { key: "reportPost", label: "Báo cáo bài viết" },
        { key: "reportUser", label: "Báo cáo người dùng" },
      ].filter(Boolean) as { key: string; label: string }[],
    [isMe, isSaved, post?.isCategoryFollowed]
  );

  const handleFollowCategory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryApi.followCategory(post?.categoryId ?? "");
      if (response?.isSuccess) {
        message.success("Đã theo dõi danh mục!");
      } else {
        message.error(response?.message || "Không thể theo dõi danh mục.");
      }
    } catch (_error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [post?.categoryId]);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postApi.savePost({
        userId: localStorage.getItem("x-client-id") || "",
        postId: post?.id,
      });
      if (response?.isSuccess) {
        message.success("Đã lưu bài viết!");
      } else {
        message.error(response?.message || "Không thể lưu bài viết.");
      }
    } catch (_error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [post]);

  const handleUnSave = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postApi.unSavePost(post?.id);
      if (response?.isSuccess) {
        message.success("Đã bỏ lưu bài viết!");
      } else {
        message.error(response?.message || "Không thể bỏ lưu bài viết.");
      }
    } catch (_error) {
      message.error("Lỗi hệ thống, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [post]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      switch (key) {
        case "edit":
          toggleEditModal(true);
          break;
        case "delete":
          handleDelete();
          break;
        case "followCategory":
          handleFollowCategory();
          break;
        case "save":
          handleSave();
          break;
        case "unsave":
          handleUnSave();
          break;
        case "reportPost":
          setReportTarget(TargetType.Post);
          setIsReportModalOpen(true);
          break;
        case "reportUser":
          setReportTarget(TargetType.User);
          setIsReportModalOpen(true);
          break;
        default:
          break;
      }
    },
    [
      handleDelete,
      toggleEditModal,
      handleFollowCategory,
      handleSave,
      handleUnSave,
    ]
  );

  const renderMedia = useCallback(
    (url: string) => {
      const fileType = getFileType(url);
      const commonStyles: React.CSSProperties = {
        maxHeight: "400px",
        maxWidth: "100%",
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover",
      };

      switch (fileType) {
        case "image":
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                src={url}
                alt="post-media"
                style={commonStyles}
                preview={{ src: url }}
                loading="lazy"
                onLoad={() => setMediaLoading(false)}
              />
            </div>
          );
        case "video":
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {mediaLoading && <Skeleton.Image active style={commonStyles} />}
              <video
                controls
                style={commonStyles}
                onLoadedData={() => setMediaLoading(false)}
              >
                <source
                  src={url}
                  type={`video/${url.split(".").pop()?.toLowerCase()}`}
                />
                Trình duyệt không hỗ trợ video.
              </video>
            </div>
          );
        case "audio":
          return (
            <>
              {mediaLoading && <Skeleton active paragraph={{ rows: 1 }} />}
              <audio
                controls
                style={{ width: "100%" }}
                onLoadedData={() => setMediaLoading(false)}
              >
                <source
                  src={url}
                  type={`audio/${url.split(".").pop()?.toLowerCase()}`}
                />
                Trình duyệt không hỗ trợ audio.
              </audio>
            </>
          );
        case "pdf":
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {mediaLoading && <Skeleton.Image active style={commonStyles} />}
              <iframe
                src={url}
                width="100%"
                height="600px"
                title="PDF viewer"
                onLoad={() => setMediaLoading(false)}
                style={{ borderRadius: "8px" }}
              />
            </div>
          );
        default:
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Xem file đính kèm
            </a>
          );
      }
    },
    [mediaLoading]
  );

  const renderIconPrivacy = useMemo(() => {
    switch (post?.privacy) {
      case PrivacyPost.Public:
        return <IoEarthSharp size={12} />; // Public icon
      case PrivacyPost.FriendsOnly:
        return <FaUserFriends size={12} />; // Friends icon
      case PrivacyPost.Private:
        return <FaLock size={12} />; // Private icon
      default:
        return null; // Default case to handle unexpected values
    }
  }, [post?.privacy]);

  const handleVote = useCallback(
    async (newVoteType: 1 | 2 | 3) => {
      setLoading(true);
      try {
        const result = await dispatch(
          votePost({
            userId: localStorage.getItem("x-client-id") || "",
            postId: post?.id,
            voteType: newVoteType,
          })
        ).unwrap();

        if (result) {
          const messages = {
            1: "Upvote thành công!",
            2: "Downvote thành công!",
            3: "Bỏ phiếu thành công!",
          };
          message.success(messages[newVoteType]);

          const votesCont = post?.votesCount;
          const prevVoteType = post?.userVoteType;

          setNumberOfVotes(() => {
            const voteChanges = {
              "1->3": -1, // Remove upvote
              "2->3": 1, // Remove downvote
              "1->2": -2, // Change from upvote to downvote
              "2->1": 2, // Change from downvote to upvote
              "null->1": 1, // Upvote
              "null->2": -1, // Downvote
            };

            const key = `${prevVoteType ?? "null"}->${newVoteType}`;
            return votesCont + (voteChanges[key] || 0);
          });

          setVoteType(newVoteType === 3 ? null : newVoteType);
        } else {
          const errorMessages = {
            1: "Không thể upvote bài viết.",
            2: "Không thể downvote bài viết.",
            3: "Không thể bỏ phiếu bài viết.",
          };
          message.error(errorMessages[newVoteType]);
        }
      } catch {
        const errorMessages = {
          1: "Không thể upvote bài viết.",
          2: "Không thể downvote bài viết.",
          3: "Không thể bỏ phiếu bài viết.",
        };
        message.error(errorMessages[newVoteType]);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, post?.id, post?.userVoteType, post?.votesCount]
  );

  return (
    <Badge.Ribbon
      text={
        post?.isCategoryFollowed
          ? `⭐ ${post?.categoryName}`
          : post?.categoryName
      }
      color={randomRibbonColor}
      placement="end"
      className="absolute top-[-5px]"
    >
      <div className="post-box mb-3 border border-gray-200 rounded-lg p-3 min-w-[500px] bg-white shadow-sm">
        <div className="post-header flex justify-between items-center">
          <div className="post-info flex items-center gap-2">
            <Avatar src={avatarSrc} size={40} />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <h2
                  className="flex items-center category-name text-sm font-semibold cursor-pointer"
                  onClick={() =>
                    navigate(`/profile/${post?.user?.id}`, {
                      state: { isWatching: true },
                    })
                  }
                >
                  {post?.user?.username}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <span className="create-date text-xs font-[450]">
                  {timeToLast(new Date(post?.createdAt))}
                </span>
                <span className="dot-separator text-xs font-[450]">•</span>
                {renderIconPrivacy}
              </div>
            </div>
          </div>
          <Space>
            {/* {!isFollowing && !isMe && (
              <Button
                className="follow-btn bg-primary rounded-2xl hover:bg-primary"
                icon={<PlusOutlined />}
                type="primary"
                size="small"
                onClick={handleFollow}
              >
                Theo dõi
              </Button>
            )} */}

            {
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                trigger={["click"]}
              >
                <span className="flex items-center gap-1 cursor-pointer">
                  <IoIosMore className="icon-more text-lg" />
                  <Button
                    type="text"
                    className="report-btn text-gray-400 hover:text-red-500 p-0"
                    icon={<span className="material-icons">flag</span>}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsReportModalOpen(true);
                    }}
                  />
                </span>
              </Dropdown>
            }
          </Space>
        </div>

        <div className="post-content mt-3">
          <p className="post-text text-sm mb-2">{post?.content}</p>
          {post?.mediaUrl?.trim() && (
            <div className="w-full mt-2 rounded-md">
              {renderMedia(post?.mediaUrl)}
            </div>
          )}
        </div>

        <div className="post-footer flex items-center gap-6 mt-4 border-t border-gray-200 pt-2">
          <div className="vote-controls flex items-center gap-2">
            <Button
              type="text"
              className={`text-xl transition-colors duration-300 ${
                voteType === 1
                  ? "text-primary"
                  : "text-gray-400 hover:text-primary"
              }`}
              icon={<PiArrowFatUpLight />}
              onClick={() => handleVote(voteType === 1 ? 3 : 1)}
              loading={loading && voteType === 1}
            />
            <span className={`vote-count text-sm font-semibold`}>
              {numberOfVotes}
            </span>
            <Button
              type="text"
              className={`text-xl transition-colors duration-300 ${
                voteType === 2
                  ? "text-primary"
                  : "text-gray-400 hover:text-primary"
              }`}
              icon={<PiArrowFatDownLight />}
              onClick={() => handleVote(voteType === 2 ? 3 : 2)}
              loading={loading && voteType === 2}
            />
          </div>
          <Button
            className="comment-btn flex items-center gap-2 text-gray-500 hover:text-primary transition-colors duration-300"
            icon={<FaRegComment className="text-lg" />}
            type="text"
            size="small"
            onClick={() => setIsCommentModalVisible(true)}
          >
            <span className="text-sm font-medium">
              {post?.commentsCount} Comments
            </span>
          </Button>
          <Button
            className="share-btn flex items-center gap-2 text-gray-500 hover:text-primary transition-colors duration-300"
            icon={<RiShareForwardLine className="text-lg" />}
            type="text"
            size="small"
          >
            <span className="text-sm font-medium">Share</span>
          </Button>
          <Button
            className="report-btn flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors duration-300"
            icon={<span className="material-icons">flag</span>}
            type="text"
            size="small"
            onClick={() => setIsReportModalOpen(true)}
          >
            <span className="text-sm font-medium">Báo cáo</span>
          </Button>
        </div>

        <Modal
          title="Chỉnh sửa bài viết"
          open={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={() => toggleEditModal(false)}
          okText="Cập nhật"
          cancelText="Hủy"
          destroyOnClose
          confirmLoading={loading}
        >
          <Form layout="vertical">
            <Form.Item label="Nội dung">
              <Input.TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
              />
            </Form.Item>
            <Form.Item label="Media URL">
              <Input
                value={editMediaUrl}
                onChange={(e) => setEditMediaUrl(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Bình luận"
          open={isCommentModalVisible}
          onCancel={() => setIsCommentModalVisible(false)}
          footer={null}
          width={"850px"}
          className="comment-modal"
        >
          <div className="max-h-[70vh] p-4 overflow-y-auto">
            <PostBox post={post} />
            <CommentList postId={post?.id} />{" "}
          </div>
        </Modal>
        <ReportModal
          open={isReportModalOpen}
          onCancel={() => {
            setIsReportModalOpen(false);
            setReportTarget(null);
          }}
          targetType={reportTarget as TargetType}
          targetId={reportTarget === TargetType.User ? post.user.id : post.id}
        />
      </div>
    </Badge.Ribbon>
  );
});

PostBox.displayName = "PostBox";

export default PostBox;
