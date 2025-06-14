import { useSignalR } from "@/context/SignalRContext";
import { User } from "@/types/user";
import { Avatar, Button, Input } from "antd";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  lazy,
  Suspense,
  useCallback,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { chatApi } from "@/api/chatApi";
import { API_URL } from "@/api/repository";

const Dropdown = lazy(() =>
  import("antd").then((module) => ({ default: module.Dropdown }))
);
const IoMdArrowDropdown = lazy(() =>
  import("react-icons/io").then((module) => ({
    default: module.IoMdArrowDropdown,
  }))
);
const AiOutlinePaperClip = lazy(() =>
  import("react-icons/ai").then((module) => ({
    default: module.AiOutlinePaperClip,
  }))
);

// Types
type ChatProps = {
  conversationId: string;
  receiver: User;
  setOpenChat: (value: any) => void;
};

// Memoized file preview component
const FilePreview = memo(({ url }: { url: string }) => {
  const isImage = /\.(jpeg|webp|jpg|png|gif)$/i.test(url);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

  if (isImage) {
    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden max-w-xs">
        <img
          src={url}
          alt="Preview"
          className="w-full object-contain rounded-lg"
          style={{ maxHeight: "220px" }}
          loading="lazy"
        />
      </div>
    );
  } else if (isVideo) {
    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden max-w-xs">
        <video
          src={url}
          controls
          className="w-full rounded-lg"
          style={{ maxHeight: "220px" }}
        />
      </div>
    );
  } else {
    return (
      <div className="p-2 border border-gray-200 rounded-lg bg-white flex items-center gap-2 max-w-xs">
        <Suspense fallback={<div>Loading...</div>}>
          <AiOutlinePaperClip />
        </Suspense>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-all text-xs"
        >
          {url}
        </a>
      </div>
    );
  }
});

FilePreview.displayName = "FilePreview";

const Chat = memo(({ conversationId, receiver, setOpenChat }: ChatProps) => {
  const {
    joinConversation,
    sendMessage,
    messages,
    addMessagesToConversation,
    connectionState,
  } = useSignalR();

  const [messageContent, setMessageContent] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasFetchedHistory, setHasFetchedHistory] = useState<
    Record<string, boolean>
  >({});

  const userId = localStorage.getItem("x-client-id");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const chatHistory = useMemo(
    () => messages[conversationId] || [],
    [messages, conversationId]
  );

  // Memoized callbacks for better performance
  const handleSendMessage = useCallback(
    async (content?: string, type: string = "text") => {
      const msgContent = content !== undefined ? content : messageContent;
      if (!msgContent.trim()) return;
      if (connectionState !== "Đã kết nối") {
        window.alert(
          "Không thể gửi tin nhắn: Kết nối chưa sẵn sàng. Vui lòng thử lại sau."
        );
        return;
      }

      try {
        await sendMessage(conversationId, msgContent, type);
      } catch (error) {
        window.alert(
          "Không thể gửi tin nhắn: Kết nối chưa sẵn sàng hoặc có lỗi mạng."
        );
        console.error("Error sending message:", error);
      }
      if (type === "text") setMessageContent("");
    },
    [messageContent, connectionState, sendMessage, conversationId]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
          const uploadResponse = await axios.post(
            `${API_URL}/interact/upload/file`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          if (uploadResponse.data?.url) {
            await handleSendMessage(uploadResponse.data.url, "file");
          } else {
            throw new Error("Lỗi khi tải file!");
          }
        } catch (error) {
          console.error("Lỗi khi tải file:", error);
        } finally {
          setUploading(false);
        }
      }
    },
    [handleSendMessage]
  );

  const handleNavigateToProfile = useCallback(() => {
    navigate(`/profile/${receiver?.id}`, {
      state: { isWatching: true },
    });
    setShowDropdown(false);
  }, [navigate, receiver?.id]);

  const handleCloseChat = useCallback(() => {
    setOpenChat(null);
  }, [setOpenChat]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Effects
  useEffect(() => {
    joinConversation(conversationId);
    if (!hasFetchedHistory[conversationId]) {
      chatApi.getChatHistory({ conversationId }).then((res) => {
        if (Array.isArray(res.data)) {
          addMessagesToConversation(conversationId, res.data);
        }
        setHasFetchedHistory((prev) => ({ ...prev, [conversationId]: true }));
      });
    }
  }, [
    conversationId,
    joinConversation,
    addMessagesToConversation,
    hasFetchedHistory,
  ]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Memoized dropdown menu
  const dropdownMenu = useMemo(
    () => (
      <div className="bg-white border rounded shadow-lg">
        <Button
          type="text"
          block
          className="text-left px-4 py-2"
          onClick={handleNavigateToProfile}
        >
          Xem trang cá nhân
        </Button>
      </div>
    ),
    [handleNavigateToProfile]
  );

  return (
    <div className="p-5 font-sans max-w-xl mx-auto">
      <div className="flex items-center justify-between bg-white rounded-t-lg shadow px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <img
            src={receiver.profilePictureUrl || "/avatardefault.png"}
            alt={receiver.username || "avatar"}
            className="w-8 h-8 rounded-full border object-cover"
            loading="lazy"
          />
          <span className="font-semibold text-gray-700 text-sm">
            {receiver.username || "Người dùng"}
          </span>
          <Suspense fallback={<div>Loading...</div>}>
            <Dropdown
              open={showDropdown}
              onOpenChange={setShowDropdown}
              trigger={["click"]}
              overlay={dropdownMenu}
              placement="bottom"
            >
              <Button type="text" shape="circle">
                <Suspense fallback={<div>Loading...</div>}>
                  <IoMdArrowDropdown />
                </Suspense>
              </Button>
            </Dropdown>
          </Suspense>
        </div>
        <button
          className="text-gray-400 hover:text-red-500 text-lg font-bold py-1 rounded transition-colors"
          onClick={handleCloseChat}
          title="Đóng hội thoại"
        >
          ×
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg p-3 h-96 overflow-y-scroll bg-white relative flex flex-col">
        {chatHistory?.map((msg, index) => {
          const isMe = msg.senderId === userId;
          const isFile = msg.type === "file";
          return (
            <div
              key={`${msg.id}-${index}`}
              className={`flex items-end gap-2 mb-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <Avatar
                  src={receiver?.profilePictureUrl ?? "/avatardefault.png"}
                  size={36}
                  className="shadow-sm bg-gray-200 border"
                />
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow animate-fade-in text-sm transition-all duration-300 ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-md text-right"
                    : "bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-md text-left"
                }`}
              >
                {!isMe && (
                  <span className="block text-xs text-gray-500 mb-1 font-semibold">
                    {receiver?.username}
                  </span>
                )}
                <span className="break-words whitespace-pre-line">
                  {isFile ? <FilePreview url={msg.content} /> : msg.content}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Input.TextArea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Nhập tin nhắn..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          className="flex-1 px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-none"
          onPressEnter={handleKeyPress}
        />
        <input
          type="file"
          id="chat-file-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Button
            icon={<AiOutlinePaperClip />}
            shape="circle"
            onClick={() => document.getElementById("chat-file-upload")?.click()}
            loading={uploading}
          />
        </Suspense>{" "}
        <Button
          type="primary"
          shape="round"
          onClick={() => handleSendMessage()}
          className="px-6 py-2 font-semibold shadow"
          loading={uploading}
          disabled={connectionState !== "Đã kết nối"}
        >
          Gửi
        </Button>
      </div>

      <style>{`
        @keyframes pop-bubble {
          0% { transform: scale(0.7) translate(-50%, -50%); opacity: 0; }
          50% { transform: scale(1.1) translate(-50%, -50%); opacity: 1; }
          100% { transform: scale(1) translate(-50%, -50%); opacity: 0; }
        }
        .animate-pop-bubble {
          animation: pop-bubble 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s;
        }
      `}</style>
    </div>
  );
});

Chat.displayName = "Chat";

export default Chat;
