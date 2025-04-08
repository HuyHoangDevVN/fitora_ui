interface User {
  id: string;
  isFriend: boolean;
  isFollowing: boolean;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: number;
  address: string;
  phoneNumber: string;
  profilePictureUrl: string;
  bio: string | null;
}

export interface Post {
  id: string;
  groupId: string | null;
  categoryId: string | null;
  categoryName: string | null;
  content: string;
  mediaUrl: string;
  votesCount: number;
  commentsCount: number;
  score: number;
  privacy: number;
  user: User;
  userVoteType: 1 | 2 | null; // 1: Upvote, 2: Downvote, null: No vote
  isCategoryFollowed?: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
}

export interface CommentResponse {
  id: string;
  userId: string;
  postId: string;
  parentCommentId: string;
  content: string;
  mediaUrl: string;
  votes: number;
  replyCount: number;
  score: number;
  user: User;
  userVoteType: 1 | 2 | null; // 1: Upvote, 2: Downvote, null: No vote
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
}
