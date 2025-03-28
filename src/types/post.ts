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
  content: string;
  mediaUrl: string;
  votesCount: number;
  commentsCount: number;
  score: number;
  privacy: number;
  user: User;
  userVoteType: 1 | 2 | null; // 1: Upvote, 2: Downvote, null: No vote
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
}
