import { GroupPrivacy, GroupStatus } from "@/enums/group";
import { GroupResponse } from "@/types/group";
import { ResponseBase } from "@/types/responseBase";
import { userRepository } from "./repository";
import { PaginatedResult } from "@/types/paginatedResult";

//#region Interface
export interface CreateGroupFormBody {
  Name: string;
  Description: string;
  Privacy: GroupPrivacy;
  RequirePostApproval: boolean;
  CoverImageUrl?: string | null;
  AvatarUrl?: string | null;
}

export interface UpdateGroupRequest {
  Id: string;
  Name: string;
  Description: string;
  Privacy: GroupPrivacy;
  RequirePostApproval: boolean;
  CoverImageUrl?: string;
  AvatarUrl?: string;
}

export interface InviteNewMembersRequest {
  GroupId: string;
  ReceiverUserIds: string[];
}

export interface InviteNewMemberRequest {
  GroupId: string;
  ReceiverUserId: string;
}

export interface GetJoinedGroupsRequest {
  IsAll: boolean;
  PageIndex: number;
  PageSize: number;
}

export interface GetManagedGroupsRequest {
  PageIndex: number;
  PageSize: number;
}

//#region API
export const groupApi = {
  // Tạo nhóm
  createGroup: async (
    formBody: CreateGroupFormBody
  ): Promise<ResponseBase<any>> => {
    const url = `/group/create`;
    const response = await userRepository.post(url, formBody);
    if (!response) {
      throw new Error("Group not found");
    }
    return response;
  },

  // Cập nhật nhóm
  updateGroup: async (
    request: UpdateGroupRequest
  ): Promise<ResponseBase<GroupResponse>> => {
    const url = `/group/update`;
    const response = await userRepository.put(url, request);
    return response;
  },

  // Mời thành viên mới vào nhóm
  inviteNewMember: async (
    request: InviteNewMemberRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/invite-new-member`;
    const response = await userRepository.post(url, request);
    return response;
  },

  // Mời thành viên mới vào nhóm
  inviteNewMembers: async (
    request: InviteNewMembersRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/invite-new-members`;
    const response = await userRepository.post(url, request);
    return response;
  },

  // Lấy danh sách nhóm đã tham gia
  getJoinedGroups: async (
    request: GetJoinedGroupsRequest
  ): Promise<PaginatedResult<GroupResponse>> => {
    const url = `/group/get-joined-groups`;
    const queryParams = new URLSearchParams({
      IsAll: request.IsAll.toString(),
      PageIndex: request.PageIndex.toString(),
      PageSize: request.PageSize.toString(),
    }).toString();
    const response = await userRepository.get<PaginatedResult<GroupResponse>>(
      `${url}?${queryParams}`
    );
    return response ?? { pageIndex: 0, pageSize: 0, count: 0, data: [] };
  },

  getManagedGroups: async (
    request: GetManagedGroupsRequest
  ): Promise<PaginatedResult<GroupResponse>> => {
    const url = `/group/get-managed-groups`;
    const queryParams = new URLSearchParams({
      PageIndex: request.PageIndex.toString(),
      PageSize: request.PageSize.toString(),
    }).toString();
    const response = await userRepository.get<PaginatedResult<GroupResponse>>(
      `${url}?${queryParams}`
    );
    return response ?? { pageIndex: 0, pageSize: 0, count: 0, data: [] };
  },
  getGroupById: async (id: string): Promise<GroupResponse | undefined> => {
    const url = `/group/get-by-id?id=${id}`;
    const response = await userRepository.get<GroupResponse>(`${url}`);
    return (
      response ?? {
        id: "",
        name: "",
        description: "",
        privacy: GroupPrivacy.Public,
        requirePostApproval: false,
        coverImageUrl: undefined,
        avatarUrl: undefined,
        status: GroupStatus.Active,
        memberCount: 0,
      }
    );
  },

  // Xóa nhóm
  deleteGroup: async (id: string): Promise<ResponseBase<null>> => {
    const url = `/group/delete?id=${id}`;
    const response = await userRepository.delete(url);
    return response;
  },
};
