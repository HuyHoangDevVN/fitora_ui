// export interface Post {
//   postId: string | number;
//   postCategoryName: string | null;
//   postCategoryId: string | number;
//   postTitle: string | null;
//   postContent: string | null;
//   postImage?: string | null;
//   postUrl?: string | null;
//   voteQuantity: number | null;
//   numberOfComments: number | null;
//   createDate: Date;
//   createdBy: string | null;
//   createByAvatar?: string | null;
//   updateDate?: Date | null;
//   updatedBy?: string | null;
//   status: string;
//   tags?: string[];
//   slug?: string;
//   isFeatured?: boolean;
// }

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
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
}
