import { createContext, useContext, useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";
import { API_URL } from "@/api/repository";
import { authApi } from "@/api/authApi";
import { notification } from "antd";

const SignalRContext = createContext({
  messages: {} as Record<
    string,
    {
      id: string;
      senderId: string;
      conversationId: string;
      content: string;
      type: string;
      createdAt?: string;
    }[]
  >,
  joinConversation: async (_conversationId: string) => {},
  leaveConversation: async (_conversationId: string) => {},
  sendMessage: async (
    _conversationId: string,
    _content: string,
    _type: string
  ) => {},
  onMessageReceived: (
    _callback: (message: {
      id: string;
      senderId: string;
      conversationId: string;
      content: string;
      type: string;
      createdAt?: string;
    }) => void
  ) => {},
  addMessagesToConversation: (_conversationId: string, _msgs: any[]) => {},
  connectionState: "Connecting" as string,
  notifications: [] as any[],
  unreadCount: 0,
});

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<
    Record<
      string,
      {
        id: string;
        senderId: string;
        conversationId: string;
        content: string;
        type: string;
        createdAt?: string;
      }[]
    >
  >({});
  const [connectionState, setConnectionState] = useState<string>("Connecting");
  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const createConnection = async () => {
      // Kết nối chat
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${API_URL}/chat`, {
          transport:
            HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents,
          withCredentials: true,
        })
        .configureLogging(LogLevel.Information)
        .build();
      setConnection(newConnection);
      setConnectionState("Đang kết nối");
      newConnection.onclose(async (error) => {
        setConnectionState("Mất kết nối");
        if ((error as any)?.statusCode === 401) {
          await handleTokenRefresh(newConnection);
        }
      });
      newConnection.onreconnecting(() =>
        setConnectionState("Đang kết nối lại")
      );
      newConnection.onreconnected(() => setConnectionState("Đã kết nối"));
      newConnection.on(
        "ReceiveMessage",
        (
          id: string,
          senderId: string,
          conversationId: string,
          content: string,
          type: string,
          createdAt?: string
        ) => {
          setMessages((prev) => {
            const prevList = prev[conversationId] || [];
            // Tránh lặp tin nhắn theo id
            if (prevList.some((msg) => msg.id === id)) return prev;
            return {
              ...prev,
              [conversationId]: [
                ...prevList,
                { id, senderId, conversationId, content, type, createdAt },
              ].sort((a, b) =>
                a.createdAt && b.createdAt
                  ? new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                  : 0
              ),
            };
          });
        }
      );
      try {
        await newConnection.start();
        setConnectionState("Đã kết nối");
        console.log("Đã kết nối SignalR Chat");
      } catch (err) {
        setConnectionState("Mất kết nối");
        console.error("Lỗi kết nối SignalR Chat: ", err);
      }
      // Kết nối notification
      const notiConnection = new HubConnectionBuilder()
        .withUrl(`${API_URL}/noti`, {
          transport:
            HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents,
          withCredentials: true,
        })
        .configureLogging(LogLevel.Information)
        .build();
      notiConnection.on(
        "ReceiveNotification",
        (
          id,
          senderId,
          userId,
          notificationTypeId,
          content,
          isRead,
          channel,
          title
        ) => {
          setNotifications((prev) => [
            {
              id,
              senderId,
              userId,
              notificationTypeId,
              content,
              isRead,
              channel,
              title,
            },
            ...prev,
          ]);
          console.log("Nhận thông báo mới: ", {
            id,
            senderId,
            userId,
            notificationTypeId,
            content,
            isRead,
            channel,
            title,
          });
          setUnreadCount((prev) => prev + 1);
          // Bắn notification antdesign
          notification.info({
            message: title || "Thông báo mới",
            description: content,
            placement: "topRight",
          });
          console.log("Nhận thông báo mới: ", {
            message: title || "Thông báo mới",
            description: content,
          });
        }
      );
      notiConnection.on("AllNotificationsRead", () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      });
      try {
        await notiConnection.start();
        console.log("Đã kết nối SignalR Notification");
      } catch (err) {
        console.error("Lỗi kết nối SignalR Notification: ", err);
      }
    };
    createConnection();
  }, []);

  // Chỉ gọi callback, không cập nhật state để tránh lặp
  const onMessageReceived = (
    callback: (message: {
      id: string;
      senderId: string;
      conversationId: string;
      content: string;
      type: string;
      createdAt?: string;
    }) => void
  ) => {
    if (connection) {
      connection.off("ReceiveMessage");
      connection.on(
        "ReceiveMessage",
        (
          id: string,
          senderId: string,
          conversationId: string,
          content: string,
          type: string,
          createdAt?: string
        ) => {
          callback({ id, senderId, conversationId, content, type, createdAt });
        }
      );
    }
  };

  const handleTokenRefresh = async (_connection: HubConnection) => {
    try {
      const response = await authApi.refreshAccessToken();
      if (response) {
        const newConnection = new HubConnectionBuilder()
          .withUrl(`${API_URL}/chat`, {
            withCredentials: true,
          })
          .configureLogging(LogLevel.Information)
          .build();
        setConnection(newConnection);
        await newConnection.start();
      } else {
        logout();
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      logout();
    }
  };

  const joinConversation = async (conversationId: string) => {
    if (connection) {
      await connection.invoke("JoinConversation", conversationId);
    }
  };

  const leaveConversation = async (conversationId: string) => {
    if (connection) {
      await connection.invoke("LeaveConversation", conversationId);
    }
  };

  const sendMessage = async (
    conversationId: string,
    content: string,
    type: string
  ) => {
    if (!connection || connectionState !== "Connected") {
      throw new Error("Không thể gửi tin nhắn: Kết nối chưa sẵn sàng.");
    }
    await connection.invoke("SendMessage", conversationId, content, type);
  };

  // Merge lịch sử, tránh lặp theo id
  const addMessagesToConversation = (
    conversationId: string,
    msgs: {
      id: string;
      senderId: string;
      conversationId: string;
      content: string;
      type: string;
      createdAt?: string;
    }[]
  ) => {
    setMessages((prev) => {
      const prevList = prev[conversationId] || [];
      const merged = [...msgs, ...prevList].reduce((acc, cur) => {
        if (!acc.find((m) => m.id === cur.id)) acc.push(cur);
        return acc;
      }, [] as typeof prevList);
      return {
        ...prev,
        [conversationId]: merged.sort((a, b) =>
          a.createdAt && b.createdAt
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : 0
        ),
      };
    });
  };

  return (
    <SignalRContext.Provider
      value={{
        messages,
        joinConversation,
        leaveConversation,
        sendMessage,
        onMessageReceived,
        addMessagesToConversation,
        connectionState,
        notifications,
        unreadCount,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login";
}

// eslint-disable-next-line
export const useSignalR = () => useContext(SignalRContext);
