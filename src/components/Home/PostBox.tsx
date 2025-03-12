import { PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Image,
  message,
  Modal,
  Space,
  Skeleton,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { BsDot } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { RiShareForwardLine } from "react-icons/ri";

import { interactRepository } from "@/_base/const/Repository";
import { Post } from "@/interfaces/Post";
import { timeToLast } from "@/utils/FunctionHelpper";

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

type PostBoxProps = { post: Post };

const PostBox: React.FC<PostBoxProps> = React.memo(({ post }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editMediaUrl, setEditMediaUrl] = useState(post.mediaUrl);
  const [loading, setLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(true);

  const avatarSrc = useMemo(
    () => post?.user?.profilePictureUrl || DEFAULT_AVATAR,
    [post?.user?.profilePictureUrl]
  );
  const isMe = useMemo(
    () => post?.user.id === localStorage.getItem("x-client-id"),
    [post?.user.id]
  );

  const toggleEditModal = useCallback(
    (visible: boolean) => setIsEditModalVisible(visible),
    []
  );

  const handleEditOk = useCallback(async () => {
    setLoading(true);
    try {
      await interactRepository.put(`/post/update-post/${post.id}`, {
        content: editContent,
        mediaUrl: editMediaUrl,
        privacy: post.privacy,
      });
      toggleEditModal(false);
      message.success("Cập nhật bài viết thành công");
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Cập nhật bài viết thất bại");
    } finally {
      setLoading(false);
    }
  }, [editContent, editMediaUrl, post.id, post.privacy, toggleEditModal]);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: "Xóa bài viết",
      content: "Bạn có chắc muốn xóa bài viết này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          await interactRepository.delete(`/post/delete-post/${post.id}`);
          message.success("Xóa bài viết thành công");
        } catch (error) {
          console.error("Error deleting post:", error);
          message.error("Xóa bài viết thất bại");
        } finally {
          setLoading(false);
        }
      },
    });
  }, [post.id]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      if (key === "edit") toggleEditModal(true);
      else if (key === "delete") handleDelete();
    },
    [handleDelete, toggleEditModal]
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

  const menuItems = useMemo(
    () => [
      { key: "edit", label: "Chỉnh sửa" },
      { key: "delete", label: "Xoá bài viết" },
    ],
    []
  );

  return (
    <div className="post-box mb-3 border rounded-lg p-3 bg-white shadow-sm">
      <div className="post-header flex justify-between items-center">
        <div className="post-info flex items-center gap-2">
          <Avatar src={avatarSrc} size={40} />
          <h2 className="category-name text-xs font-semibold cursor-pointer">
            {post.user.username}
          </h2>
          <BsDot />
          <span className="create-date text-xs font-semibold">
            {timeToLast(new Date(post.createdAt))}
          </span>
        </div>
        <Space>
          {!post.user.isFollowing && !isMe && (
            <Button
              className="follow-btn bg-primary rounded-2xl hover:bg-primary"
              icon={<PlusOutlined />}
              type="primary"
              size="small"
            >
              Theo dõi
            </Button>
          )}
          {isMe && (
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              trigger={["click"]}
            >
              <IoIosMore className="icon-more cursor-pointer text-lg" />
            </Dropdown>
          )}
        </Space>
      </div>

      <div className="post-content mt-3">
        <p className="post-text text-sm mb-2">{post.content}</p>
        {post.mediaUrl?.trim() && (
          <div className="w-full mt-2 rounded-md">
            {renderMedia(post.mediaUrl)}
          </div>
        )}
      </div>

      <div className="post-footer flex items-center gap-2 mt-3">
        <div className="vote-controls flex items-center bg-gray-100 rounded-2xl px-2">
          <Button type="text" icon={<PiArrowFatUpLight />} />
          <span className="vote-count text-xs font-medium">
            {post.votesCount}
          </span>
          <Button type="text" icon={<PiArrowFatDownLight />} />
        </div>
        <Button
          className="comment-btn bg-gray-100 rounded-2xl flex items-center gap-1"
          icon={<FaRegComment />}
          type="text"
          size="small"
        >
          {post.commentsCount}
        </Button>
        <Button
          className="share-btn bg-gray-100 rounded-2xl flex items-center gap-1"
          icon={<RiShareForwardLine />}
          type="text"
          size="small"
        >
          Share
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
    </div>
  );
});

PostBox.displayName = "PostBox";

export default PostBox;
