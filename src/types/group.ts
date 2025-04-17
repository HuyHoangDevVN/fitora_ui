import { GroupPrivacy, GroupStatus } from "@/enums/group";

export interface GroupResponse {
  id: string;
  name?: string | null;
  description?: string | null;
  privacy?: GroupPrivacy | null;
  requirePostApproval?: boolean | null;
  coverImageUrl?: string | null;
  avatarUrl?: string | null;
  status?: GroupStatus | null;
  memberCount?: number | null;
}

export interface MemberResponse {
  id: string;
  groupId?: string | null;
  groupName?: string | null;
  groupDescription?: string | null;
  groupPictureUrl?: string | null;
  groupBackgroundPictureUrl?: string | null;
  userId?: string | null;
  userName?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  gender?: number | null;
  address?: string | null;
  phoneNumber?: string | null;
  profilePictureUrl?: string | null;
  profileBackgroundPictureUrl?: string | null;
  bio?: string | null;
  role?: number | null;
  joinedAt?: string | null;
}
