import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { useSignalR } from "@/context/SignalRContext";
import { Avatar, Button, message, Tooltip, Typography } from "antd";
import { groupApi } from "@/api/groupApi";
import { BellOutlined } from "@ant-design/icons";

function timeAgo(dateString?: string) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return date.toLocaleDateString();
}

interface Invite {
  id: string;
  groupId: string;
  groupName: string;
  groupImageUrl: string;
  senderUserId: string;
  senderName: string;
  senderImageUrl: string;
  receiverUserId: string;
  receiverName: string;
  receiverImageUrl: string;
  status: number;
}

// Memoized invite item component
const InviteItem = memo(
  ({
    item,
    onAccept,
    onDeny,
  }: {
    item: Invite;
    onAccept: (id: string) => void;
    onDeny: (id: string) => void;
  }) => (
    <li
      key={item.id}
      className="flex flex-col gap-1 p-2 mb-2 rounded-lg border border-gray-100 custom-dark:border-gray-800 bg-gray-50 custom-dark:bg-gray-900"
    >
      <div className="flex items-center gap-2">
        <Avatar src={item.groupImageUrl} size={32} className="mr-2" />
        <div>
          <Typography.Text strong>{item.groupName}</Typography.Text>
          <div className="text-xs text-gray-500">
            Gửi bởi: {item.senderName}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <Button
          size="small"
          type="link"
          className="text-blue-500 p-0"
          onClick={() => onAccept(item.id)}
        >
          Chấp nhận
        </Button>
        <Button
          size="small"
          type="link"
          className="text-red-500 p-0"
          onClick={() => onDeny(item.id)}
        >
          Từ chối
        </Button>
      </div>
    </li>
  )
);

InviteItem.displayName = "InviteItem";

const NotificationDropdown = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useSignalR();

  // Group invite logic
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingInvites(true);
      groupApi
        .getReceivedGroupInvites({ PageIndex: 0, PageSize: 10 })
        .then((response) => {
          setInvites(response.data?.data ? response.data.data : []);
        })
        .catch(() => {
          message.error("Không thể lấy lời mời nhóm.");
        })
        .finally(() => setLoadingInvites(false));
    }
  }, [isOpen]);

  const handleAccept = useCallback(async (id: string) => {
    try {
      await groupApi.acceptGroupInvite({ Id: id });
      message.success("Đã chấp nhận lời mời.");
      setInvites((prev) => prev.filter((invite) => invite.id !== id));
    } catch {
      message.error("Không thể chấp nhận lời mời.");
    }
  }, []);

  const handleDeny = useCallback(async (id: string) => {
    try {
      await groupApi.deleteGroupInvite({ Id: id });
      message.success("Đã từ chối lời mời.");
      setInvites((prev) => prev.filter((invite) => invite.id !== id));
    } catch {
      message.error("Không thể từ chối lời mời.");
    }
  }, []);

  // Memoize expensive computations
  const hasNotifications = useMemo(() => {
    return notifications.length > 0 || invites.length > 0;
  }, [notifications.length, invites.length]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Mark all as read when dropdown opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Gửi sự kiện lên server nếu cần, ở đây chỉ cập nhật local state qua SignalRContext
      // SignalRContext đã lắng nghe sự kiện AllNotificationsRead từ server
      // Nếu cần, có thể invoke một hàm ở context để mark all as read
      // (Giả sử context đã xử lý logic này qua sự kiện SignalR)
      // Nếu cần invoke, thêm hàm markAllAsRead vào context và gọi ở đây
      // Ví dụ: markAllAsRead();
      // Hiện tại chỉ rely vào SignalR event
    }
  }, [isOpen, unreadCount]);

  return (
    <div className="relative">
      <Tooltip title="Thông báo">
        <Button
          shape="circle"
          icon={<BellOutlined />}
          onClick={toggleDropdown}
        />
      </Tooltip>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-max w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg custom-dark:border-gray-800 custom-dark:bg-gray-custom-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 custom-dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 custom-dark:text-gray-200">
            Thông báo
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition custom-dark:text-gray-400 hover:text-gray-700 custom-dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        {/* Group Invites Section */}
        <div className="mb-2">
          {loadingInvites ? (
            <div className="text-center text-gray-500 py-2">
              Đang tải lời mời nhóm...
            </div>
          ) : invites.length > 0 ? (
            <>
              <div className="text-xs font-semibold text-gray-500 mb-1">
                Lời mời vào nhóm
              </div>
              <ul className="mb-2">
                {invites.map((item) => (
                  <InviteItem
                    key={item.id}
                    item={item}
                    onAccept={handleAccept}
                    onDeny={handleDeny}
                  />
                ))}
              </ul>
            </>
          ) : null}
        </div>
        {/* Notifications Section */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {!hasNotifications && (
            <li className="text-center text-gray-400 py-8">
              Không có thông báo nào
            </li>
          )}
          {notifications.map((noti) => (
            <li key={noti.id}>
              <DropdownItem
                onItemClick={closeDropdown}
                className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 custom-dark:border-gray-800 custom-dark:hover:bg-white/5 ${
                  noti.isRead ? "opacity-60" : ""
                }`}
              >
                <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                  <img
                    width={40}
                    height={40}
                    src={noti.avatarUrl || "/avatardefault.png"}
                    alt="User"
                    className="w-full overflow-hidden rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white ${
                      noti.isRead
                        ? "bg-gray-300 custom-dark:border-gray-900"
                        : "bg-orange-400 custom-dark:border-gray-900"
                    }`}
                  ></span>
                </span>
                <span className="block">
                  <span className="mb-1.5 block text-theme-sm text-gray-500 custom-dark:text-gray-400 space-x-1">
                    <span className="font-medium text-gray-800 custom-dark:text-white/90">
                      {noti.senderName || "Hệ thống"}
                    </span>
                    <span> {noti.content} </span>
                  </span>
                  <span className="flex items-center gap-2 text-gray-500 text-theme-xs custom-dark:text-gray-400">
                    <span>{noti.channel || "Thông báo"}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{timeAgo(noti.createdAt)}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
        <Link
          to="/"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 custom-dark:border-gray-700 custom-dark:bg-gray-800 custom-dark:text-gray-400 custom-dark:hover:bg-gray-700"
        >
          Xem tất cả thông báo
        </Link>
      </Dropdown>
    </div>
  );
});

NotificationDropdown.displayName = "NotificationDropdown";

export default NotificationDropdown;
