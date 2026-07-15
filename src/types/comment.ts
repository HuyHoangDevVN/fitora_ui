export interface Comment {
  userId: string;
  postId: string;
  parentCommentId?: string | null;
  content: string;
  mediaUrl?: string;
  votesCont?: number;
  replyCount?: number;
  isDeleted?: boolean;
}
