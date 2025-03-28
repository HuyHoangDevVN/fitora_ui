export interface FriendInvite {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderImageUrl: string;
  receiverName: string;
  receiverImageUrl: string;
  status: number;
  createDate: string;
}
