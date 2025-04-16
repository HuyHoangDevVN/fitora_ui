import { userRepository } from "@/api/repository";
import { FriendInvite } from "@/types/friendInvite";
import { PaginatedResult } from "@/types/paginatedResult";
import { ProfileUser } from "@/types/profileUser";
import { ResponseBase } from "@/types/responseBase";
import { User } from "@/types/user";

export interface GetListFriendsRequest {
  pageIndex: number;
  pageSize: number;
  keySearch?: string;
}

export const userApi = {
  acceptFriendRequest: async (
    senderId: string
  ): Promise<ResponseBase<null>> => {
    const url = "friendShip/accept-friend-request";
    const response = await userRepository.put(url, senderId);
    if (!response) {
      throw new Error("Failed to accept friend request");
    }
    return response;
  },
  rejectFriendRequest: async (
    senderId: string
  ): Promise<ResponseBase<null>> => {
    const url = `friendShip/delete-request?id=${senderId}`;
    const response = await userRepository.delete(url);
    if (!response) {
      throw new Error("Failed to delete friend request");
    }
    return response;
  },
  async fetchUserProfile(userId?: string): Promise<ResponseBase<ProfileUser>> {
    const url = userId ? `/user/get-user?GetId=${userId}` : `/user/profile`;
    const response = await userRepository.get<ResponseBase<ProfileUser>>(url);
    if (!response) throw new Error("Failed to fetch user profile");
    return response;
  },

  async handleUserAction(
    apiEndpoint: string,
    method: "POST" | "DELETE",
    userId: string
  ): Promise<ResponseBase<null>> {
    const response =
      method === "POST"
        ? await userRepository.post(apiEndpoint, userId)
        : await userRepository.delete(`${apiEndpoint}?id=${userId}`);
    if (!response) throw new Error("Failed to perform user action");
    return response;
  },

  async getFriendInvitations(): Promise<
    ResponseBase<PaginatedResult<FriendInvite>>
  > {
    const url = "/friendship/get-received-friend-requests";
    const response = await userRepository.get<
      ResponseBase<PaginatedResult<FriendInvite>>
    >(url);
    if (!response) throw new Error("Failed to fetch friend invitations");
    return response;
  },
  getListFriends: async (
    request: GetListFriendsRequest
  ): Promise<ResponseBase<PaginatedResult<User>>> => {
    const url = `/friendship/get-friends?pageIndex=${
      request.pageIndex
    }&pageSize=${request.pageSize}&keySearch=${encodeURIComponent(
      request.keySearch || ""
    )}`;
    const response = await userRepository.get<
      ResponseBase<PaginatedResult<User>>
    >(url);
    if (!response) {
      throw new Error("Failed to fetch list of contacts");
    }
    return response;
  },
  getListFriendsWithQuery: async (
    request: GetListFriendsRequest,
    additionalQuery: Record<string, string | number>
  ): Promise<ResponseBase<PaginatedResult<User>>> => {
    const queryParams = new URLSearchParams({
      pageIndex: request.pageIndex.toString(),
      pageSize: request.pageSize.toString(),
      ...(request.keySearch ? { keySearch: request.keySearch } : {}),
      ...Object.fromEntries(
        Object.entries(additionalQuery).map(([key, value]) => [
          key,
          value.toString(),
        ])
      ),
    }).toString();
    const url = `/friendship/get-friends?${queryParams}`;
    const response = await userRepository.get<
      ResponseBase<PaginatedResult<User>>
    >(url);
    if (!response) {
      throw new Error("Failed to fetch list of contacts with query");
    }
    return response;
  },
};
