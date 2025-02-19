export interface UserInfo {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO Date String
  gender: number; // 1: Male, 2: Female (cần định nghĩa rõ ràng)
  address: string;
  phoneNumber: string;
  profilePictureUrl: string;
  bio: string;
  id: string;
  createdAt: string | null;
  createdBy: string | null;
  lastModified: string | null;
  lastModifiedBy: string | null;
}

export interface Relationship {
  isFriend: boolean;
  isFriendRequest: boolean;
  isFollowing: boolean;
}

export interface ProfileUser {
  email: string;
  userName: string;
  followerCount: number;
  followingCount: number;
  relationship?: Relationship | null;
  userInfo: UserInfo;
}
