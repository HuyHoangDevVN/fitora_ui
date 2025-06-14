import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HttpTransportType,
} from "@microsoft/signalr";
import { API_URL } from "@/api/repository";
import { authApi } from "@/api/authApi";
import { notification } from "antd";

// Types
interface Message {
  id: string;
  senderId: string;
  conversationId: string;
  content: string;
  type: string;
  createdAt?: string;
}

interface Notification {
  id?: string;
  title?: string;
  content: string;
  isRead?: boolean;
  createdAt?: string;
}

interface SignalRContextType {
  messages: Record<string, Message[]>;
  joinConversation: (conversationId: string) => Promise<void>;
  leaveConversation: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    content: string,
    type: string
  ) => Promise<void>;
  onMessageReceived: (callback: (message: Message) => void) => void;
  addMessagesToConversation: (conversationId: string, msgs: Message[]) => void;
  connectionState: string;
  notifications: Notification[];
  unreadCount: number;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

// Constants
const CONNECTION_STATES = {
  CONNECTING: "Đang kết nối",
  CONNECTED: "Đã kết nối",
  DISCONNECTED: "Mất kết nối",
  RECONNECTING: "Đang kết nối lại",
} as const;

const HUB_ENDPOINTS = {
  CHAT: `${API_URL}/chat`,
  NOTIFICATION: `${API_URL}/noti`,
} as const;

// Default context value
const defaultContextValue: SignalRContextType = {
  messages: {},
  joinConversation: async () => {},
  leaveConversation: async () => {},
  sendMessage: async () => {},
  onMessageReceived: () => {},
  addMessagesToConversation: () => {},
  connectionState: CONNECTION_STATES.CONNECTING,
  notifications: [],
  unreadCount: 0,
  markAllNotificationsAsRead: () => {},
  clearNotifications: () => {},
};

const SignalRContext = createContext<SignalRContextType>(defaultContextValue);

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // State
  const [chatConnection, setChatConnection] = useState<HubConnection | null>(
    null
  );
  const [_notificationConnection, setNotificationConnection] =
    useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [connectionState, setConnectionState] = useState<string>(
    CONNECTION_STATES.CONNECTING
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs to prevent stale closures
  const mountedRef = useRef(true);

  // Utility functions
  const sortMessagesByDate = useCallback((messages: Message[]): Message[] => {
    return messages.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, []);

  const isDuplicateMessage = useCallback(
    (messageList: Message[], newMessage: Message): boolean => {
      return messageList.some((msg) => msg.id === newMessage.id);
    },
    []
  );

  // Connection builders
  const createChatConnection = useCallback((): HubConnection => {
    return new HubConnectionBuilder()
      .withUrl(HUB_ENDPOINTS.CHAT, {
        transport:
          HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents,
        withCredentials: true,
      })
      .configureLogging(LogLevel.Information)
      .build();
  }, []);

  const createNotificationConnection = useCallback((): HubConnection => {
    return new HubConnectionBuilder()
      .withUrl(HUB_ENDPOINTS.NOTIFICATION, {
        transport:
          HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents,
        withCredentials: true,
      })
      .configureLogging(LogLevel.Information)
      .build();
  }, []); // Connection setup with proper error handling
  const setupChatConnection = useCallback(async () => {
    if (!mountedRef.current) return;

    const connection = createChatConnection();

    // Event handlers
    connection.onclose(async (error) => {
      if (!mountedRef.current) return;
      setConnectionState(CONNECTION_STATES.DISCONNECTED);
      if ((error as any)?.statusCode === 401) {
        // Handle token refresh inline to avoid dependency issues
        try {
          const response = await authApi.refreshAccessToken();
          if (response) {
            // Will be handled by the reconnection logic
          } else {
            logout();
          }
        } catch (err) {
          console.error("Error refreshing token:", err);
          logout();
        }
      }
    });

    connection.onreconnecting(() => {
      if (mountedRef.current) {
        setConnectionState(CONNECTION_STATES.RECONNECTING);
      }
    });

    connection.onreconnected(() => {
      if (mountedRef.current) {
        setConnectionState(CONNECTION_STATES.CONNECTED);
      }
    });

    // Message handler with duplicate prevention
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
        if (!mountedRef.current) return;

        const newMessage: Message = {
          id,
          senderId,
          conversationId,
          content,
          type,
          createdAt,
        };

        setMessages((prev) => {
          const prevList = prev[conversationId] || [];
          if (isDuplicateMessage(prevList, newMessage)) return prev;

          const updatedList = [...prevList, newMessage];
          return {
            ...prev,
            [conversationId]: sortMessagesByDate(updatedList),
          };
        });
      }
    );

    try {
      setConnectionState(CONNECTION_STATES.CONNECTING);
      await connection.start();
      if (mountedRef.current) {
        setChatConnection(connection);
        setConnectionState(CONNECTION_STATES.CONNECTED);
        console.log("Đã kết nối SignalR Chat");
      }
    } catch (err) {
      if (mountedRef.current) {
        setConnectionState(CONNECTION_STATES.DISCONNECTED);
        console.error("Lỗi kết nối SignalR Chat: ", err);
      }
    }
  }, [createChatConnection, isDuplicateMessage, sortMessagesByDate]);

  const setupNotificationConnection = useCallback(async () => {
    if (!mountedRef.current) return;

    const connection = createNotificationConnection();

    // Notification handlers
    connection.on("ReceiveNotification", (message: Notification) => {
      if (!mountedRef.current) return;

      setNotifications((prev) => [message, ...prev]);
      setUnreadCount((prev) => prev + 1);

      console.log("Nhận thông báo mới: ", message);

      notification.info({
        message: message.title || "Thông báo mới",
        description: message.content,
        placement: "topRight",
      });
    });

    connection.on("AllNotificationsRead", () => {
      if (!mountedRef.current) return;
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    });

    try {
      await connection.start();
      if (mountedRef.current) {
        setNotificationConnection(connection);
        console.log("Đã kết nối SignalR Notification");
      }
    } catch (err) {
      console.error("Lỗi kết nối SignalR Notification: ", err);
    }
  }, [createNotificationConnection]);

  // Initialize connections
  useEffect(() => {
    setupChatConnection();
    setupNotificationConnection();

    return () => {
      mountedRef.current = false;
    };
  }, [setupChatConnection, setupNotificationConnection]); // Message callback registration
  const onMessageReceived = useCallback(
    (callback: (message: Message) => void) => {
      if (chatConnection) {
        chatConnection.off("ReceiveMessage");
        chatConnection.on(
          "ReceiveMessage",
          (
            id: string,
            senderId: string,
            conversationId: string,
            content: string,
            type: string,
            createdAt?: string
          ) => {
            callback({
              id,
              senderId,
              conversationId,
              content,
              type,
              createdAt,
            });
          }
        );
      }
    },
    [chatConnection]
  );

  // Connection methods
  const joinConversation = useCallback(
    async (conversationId: string) => {
      if (chatConnection && connectionState === CONNECTION_STATES.CONNECTED) {
        await chatConnection.invoke("JoinConversation", conversationId);
      }
    },
    [chatConnection, connectionState]
  );

  const leaveConversation = useCallback(
    async (conversationId: string) => {
      if (chatConnection && connectionState === CONNECTION_STATES.CONNECTED) {
        await chatConnection.invoke("LeaveConversation", conversationId);
      }
    },
    [chatConnection, connectionState]
  );

  const sendMessage = useCallback(
    async (conversationId: string, content: string, type: string) => {
      if (!chatConnection || connectionState !== CONNECTION_STATES.CONNECTED) {
        throw new Error("Không thể gửi tin nhắn: Kết nối chưa sẵn sàng.");
      }
      await chatConnection.invoke("SendMessage", conversationId, content, type);
    },
    [chatConnection, connectionState]
  );

  // Message management
  const addMessagesToConversation = useCallback(
    (conversationId: string, msgs: Message[]) => {
      setMessages((prev) => {
        const prevList = prev[conversationId] || [];
        const merged = [...msgs, ...prevList].reduce((acc, cur) => {
          if (!acc.find((m) => m.id === cur.id)) acc.push(cur);
          return acc;
        }, [] as Message[]);
        return {
          ...prev,
          [conversationId]: sortMessagesByDate(merged),
        };
      });
    },
    [sortMessagesByDate]
  );

  // Notification management
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);
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
        markAllNotificationsAsRead,
        clearNotifications,
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
