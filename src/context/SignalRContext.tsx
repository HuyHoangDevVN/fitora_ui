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
      senderId: string;
      conversationId: string;
      content: string;
      type: string;
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
      senderId: string;
      conversationId: string;
      content: string;
      type: string;
    }) => void
  ) => {},
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
        senderId: string;
        conversationId: string;
        content: string;
        type: string;
      }[]
    >
  >({});

  useEffect(() => {
    const createConnection = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:5007/hubs/chat", {
          withCredentials: true,
        })
        .configureLogging(LogLevel.Information)
        .build();

      setConnection(newConnection);

      newConnection.on(
        "ReceiveMessage",
        (
          senderId: string,
          conversationId: string,
          content: string,
          type: string
        ) => {
          setMessages((prev) => {
            const prevList = prev[conversationId] || [];
            return {
              ...prev,
              [conversationId]: [
                ...prevList,
                { senderId, conversationId, content, type },
              ],
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
        if (newConnection) {
          newConnection.stop();
        }
      };
    };

    createConnection();
  }, []);

  const onMessageReceived = (
    callback: (message: {
      senderId: string;
      conversationId: string;
      content: string;
      type: string;
    }) => void
  ) => {
    if (connection) {
      connection.off("ReceiveMessage");
      connection.on(
        "ReceiveMessage",
        (
          senderId: string,
          conversationId: string,
          content: string,
          type: string
        ) => {
          const message = { senderId, conversationId, content, type };
          setMessages((prev) => {
            const prevList = prev[conversationId] || [];
            return {
              ...prev,
              [conversationId]: [...prevList, message],
            };
          });
          callback(message);
        }
      );
    }
  };

  const handleTokenRefresh = async (_connection: HubConnection) => {
    try {
      const response = await fetch(
        "https://localhost:5000/api/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
        }
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

  return (
    <SignalRContext.Provider
      value={{
        messages,
        joinConversation,
        leaveConversation,
        sendMessage,
        onMessageReceived,
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
