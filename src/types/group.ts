import { GroupPrivacy, GroupStatus } from "@/enums/group";

export interface GroupResponse {
  id: string;
  name: string;
  description: string;
  privacy: GroupPrivacy;
  requirePostApproval: boolean;
  coverImageUrl?: string;
  avatarUrl?: string;
  status: GroupStatus;
}
