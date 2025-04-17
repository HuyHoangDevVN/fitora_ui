import { GroupPrivacy, GroupStatus } from "@/enums/group";
import { GroupResponse, MemberResponse } from "@/types/group";
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

export interface CreateGroupPostRequest {
  postId: string;
  groupId: string;
  authorId: string;
  isApproved: boolean;
}

export interface AssignRoleMemberRequest {
  assignedBy: string;
  groupId: string;
  memberId: string;
  role: number;
}

export interface GetSentGroupInvitesRequest {
  PageIndex: number;
  PageSize: number;
}

// Add API to get received group invites
export interface GetReceivedGroupInvitesRequest {
  PageIndex: number;
  PageSize: number;
}

// Add API to accept group invite
export interface AcceptGroupInviteRequest {
  Id: string;
}

// Add API to delete group invite
export interface DeleteGroupInviteRequest {
  Id: string;
}

//#region API
export const groupApi = {
  // Group Management: Create, Update, Delete, and Get by ID
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

  updateGroup: async (
    request: UpdateGroupRequest
  ): Promise<ResponseBase<GroupResponse>> => {
    const url = `/group/update`;
    const response = await userRepository.put(url, request);
    return response;
  },

  deleteGroup: async (id: string): Promise<ResponseBase<null>> => {
    const url = `/group/delete?id=${id}`;
    const response = await userRepository.delete(url);
    return response;
  },

  getGroupById: async (
    id: string
  ): Promise<
    | {
        group: GroupResponse;
        groupMember: MemberResponse;
      }
    | undefined
  > => {
    const url = `/group/get-by-id?id=${id}`;
    const response = await userRepository.get<any>(`${url}`);
    return response.data ?? undefined;
  },

  // Group Membership: Assign roles, invite members, delete members, and get members
  assignRoleMember: async (
    request: AssignRoleMemberRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/assign-role-member`;
    const response = await userRepository.post(url, request);
    return response;
  },

  inviteNewMember: async (
    request: InviteNewMemberRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/invite-new-member`;
    const response = await userRepository.post(url, request);
    return response;
  },

  inviteNewMembers: async (
    request: InviteNewMembersRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/invite-new-members`;
    const response = await userRepository.post(url, request);
    return response;
  },

  getGroupMembers: async (
    groupId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<PaginatedResult<any>> => {
    const url = `/group/get-members`;
    const queryParams = new URLSearchParams({
      GroupId: groupId,
      PageIndex: pageIndex.toString(),
      PageSize: pageSize.toString(),
    }).toString();
    const response = await userRepository.get<PaginatedResult<MemberResponse>>(
      `${url}?${queryParams}`
    );
    return response ?? { pageIndex: 0, pageSize: 0, count: 0, data: [] };
  },

  // Group Invites: Manage sent/received invites and accept/delete invites
  getSentGroupInvites: async (
    request: GetSentGroupInvitesRequest
  ): Promise<PaginatedResult<any>> => {
    const url = `/group/get-sent-group-invites`;
    const queryParams = new URLSearchParams({
      PageIndex: request.PageIndex.toString(),
      PageSize: request.PageSize.toString(),
    }).toString();
    const response = await userRepository.get<PaginatedResult<any>>(
      `${url}?${queryParams}`
    );
    return response ?? { pageIndex: 0, pageSize: 0, count: 0, data: [] };
  },

  getReceivedGroupInvites: async (
    request: GetReceivedGroupInvitesRequest
  ): Promise<any> => {
    const url = `/group/get-received-group-invites`;
    const queryParams = new URLSearchParams({
      PageIndex: request.PageIndex.toString(),
      PageSize: request.PageSize.toString(),
    }).toString();
    const response = await userRepository.get<any>(`${url}?${queryParams}`);
    return response ?? { pageIndex: 0, pageSize: 0, count: 0, data: [] };
  },

  acceptGroupInvite: async (
    request: AcceptGroupInviteRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/accept-group-invite`;
    const queryParams = new URLSearchParams({
      Id: request.Id,
    }).toString();
    const response = await userRepository.post<ResponseBase<null>>(
      `${url}?${queryParams}`
    );
    return response ?? { isSuccess: false, message: "No response", data: null };
  },

  deleteGroupInvite: async (
    request: DeleteGroupInviteRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/delete-group-invite`;
    const queryParams = new URLSearchParams({
      Id: request.Id,
    }).toString();
    const response = await userRepository.delete<ResponseBase<null>>(
      `${url}?${queryParams}`
    );
    return response ?? { isSuccess: false, message: "No response", data: null };
  },

  // Group Posts: Create, update, and delete posts
  createGroupPost: async (
    request: CreateGroupPostRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/group/create-group-post`;
    const response = await userRepository.post(url, request);
    return response;
  },

  // Group Queries: Get managed and joined groups
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
};
