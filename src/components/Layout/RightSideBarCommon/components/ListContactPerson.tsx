import { User } from "@/types/user";
import ContactPersonComponent from "./ContactPersonComponent";
import { chatApi } from "@/api/chatApi";
import Chat from "@/features/chat/Chat";
import { useState, useCallback, memo } from "react";

type ListContactPersonProp = {
  people?: User[];
};

const ListContactPerson = memo(({ people }: ListContactPersonProp) => {
  const [openChat, setOpenChat] = useState<{
    conversationId: string;
    receiver: User;
  } | null>(null);

  const handleContactClick = useCallback(async (item: User) => {
    const userId = localStorage.getItem("x-client-id") || "";
    const otherUserId = item?.id;
    let conversationId = "";
    try {
      const res = await chatApi.getPrivateConversation(userId, otherUserId);
      if (res?.data) {
        conversationId = res.data.id || res.data.conversationId;
      } else {
        const createRes = await chatApi.createConversation({
          participantIds: [userId, otherUserId],
          isGroup: false,
        });
        conversationId = createRes.data;
      }
      setOpenChat({ conversationId, receiver: item });
    } catch (_e) {
      setOpenChat(null);
    }
  }, []);

  return (
    <div>
      <ul className="space-y-0">
        {people?.map((item, index) => (
          <li key={index}>
            <div onClick={() => handleContactClick(item)}>
              <ContactPersonComponent user={item} />
            </div>
          </li>
        ))}
      </ul>
      {openChat && (
        <div className="fixed bottom-0 right-4 z-50 w-[380px] max-w-full">
          <Chat
            conversationId={openChat.conversationId}
            receiver={openChat.receiver}
            setOpenChat={setOpenChat}
          />
        </div>
      )}
    </div>
  );
});

ListContactPerson.displayName = "ListContactPerson";

export default ListContactPerson;
