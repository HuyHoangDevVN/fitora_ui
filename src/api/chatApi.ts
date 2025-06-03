import { chatRepository } from "./repository";

export interface CreateConversationRequest {
  participantIds: string[];
  isGroup?: boolean;
  groupInfo?: any;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type: string;
}

export interface GetHistoryChatRequest {
  conversationId: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface AddReactionRequest {
  messageId: string;
  userId: string;
  emoji: string;
}

export interface GroupMemberRequest {
  conversationId: string;
  userId: string;
}

export interface MarkAsReadRequest {
  messageId: string;
  isRead: boolean;
}

export interface UpdateGroupInfoRequest {
  conversationId: string;
  groupInfo: any; // Có thể định nghĩa rõ hơn nếu có Group type
}

export const chatApi = {
  createConversation: async (
    request: CreateConversationRequest
  ): Promise<any> => {
    const url = "/conversations";
    const response = await chatRepository.post(url, request);
    return response;
  },

  sendMessage: async (request: SendMessageRequest): Promise<any> => {
    const url = "/send-message";
    const response = await chatRepository.post(url, request);
    return response;
  },

  getChatHistory: async (request: GetHistoryChatRequest): Promise<any> => {
    const url = "/history";
    const queryParams = new URLSearchParams({
      ConversationId: request.conversationId,
      PageIndex: (request.pageIndex ?? 0).toString(),
      PageSize: (request.pageSize ?? 10).toString(),
    }).toString();
    const response = await chatRepository.get<any>(`${url}?${queryParams}`);
    return response;
  },

  deleteMessage: async (messageId: string): Promise<any> => {
    const url = "/delete-message";
    const response = await chatRepository.post(url, messageId);
    return response;
  },

  recallMessage: async (request: GetHistoryChatRequest): Promise<any> => {
    const url = "/recall-message";
    const response = await chatRepository.post(url, request);
    return response;
  },

  addReaction: async (request: AddReactionRequest): Promise<any> => {
    const url = "/add-reaction";
    const response = await chatRepository.post(url, request);
    return response;
  },

  markAsRead: async (request: MarkAsReadRequest): Promise<any> => {
    const url = "/mark-as-read";
    const response = await chatRepository.post(url, request);
    return response;
  },

  updateGroupInfo: async (request: UpdateGroupInfoRequest): Promise<any> => {
    const url = "/update-group-info";
    const response = await chatRepository.put(url, request);
    return response;
  },

  addGroupMember: async (request: GroupMemberRequest): Promise<any> => {
    const url = "/add-group-member";
    const response = await chatRepository.post(url, request);
    return response;
  },

  removeGroupMember: async (request: GroupMemberRequest): Promise<any> => {
    const url = "/remove-group-member";
    const response = await chatRepository.post(url, request);
    return response;
  },

  assignGroupAdmin: async (request: GroupMemberRequest): Promise<any> => {
    const url = "/assign-group-admin";
    const response = await chatRepository.post(url, request);
    return response;
  },

  getGroupConversationsByUserId: async (userId: string): Promise<any> => {
    const url = "/group-conversations";
    const queryParams = new URLSearchParams({ userId }).toString();
    const response = await chatRepository.get<any>(`${url}?${queryParams}`);
    return response;
  },

  getPrivateConversation: async (
    userId: string,
    otherUserId: string
  ): Promise<any> => {
    const url = "/private-conversation";
    const queryParams = new URLSearchParams({ userId, otherUserId }).toString();
    const response = await chatRepository.get<any>(`${url}?${queryParams}`);
    return response;
  },
};
