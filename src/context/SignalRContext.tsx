import { createContext, useContext, useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from "@microsoft/signalr";

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

  useEffect(() => {
    const createConnection = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:5007/hubs/chat", { withCredentials: true })
        .configureLogging(LogLevel.Information)
        .build();
      setConnection(newConnection);
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
      newConnection.onclose(async (error) => {
        if ((error as any)?.statusCode === 401) {
          await handleTokenRefresh(newConnection);
        }
      });
      try {
        await newConnection.start();
        console.log("Connected to SignalR Hub");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
      return () => {
        newConnection.stop();
      };
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
      const response = await fetch(
        "https://localhost:5000/api/auth/refresh-token",
        { method: "POST", credentials: "include" }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5007/hubs/chat", {
              withCredentials: true,
              accessTokenFactory: () => data.token,
            })
            .configureLogging(LogLevel.Information)
            .build();
          setConnection(newConnection);
          await newConnection.start();
        } else {
          logout();
        }
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
    if (connection) {
      await connection.invoke("SendMessage", conversationId, content, type);
    }
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

export const useSignalR = () => useContext(SignalRContext);
