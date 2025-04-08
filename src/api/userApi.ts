import { userRepository } from "@/api/repository";
import { PaginatedCursorResult } from "@/types/paginatedCrusorResult";
import { Post } from "@/types/post";
import { ProfileUser } from "@/types/profileUser";
import { ResponseBase } from "@/types/responseBase";

// API chấp nhận lời mời kết bạn
export const acceptFriendRequestApi = async (
  senderId: string
): Promise<ResponseBase<null>> => {
  const url = "friendShip/accept-friend-request";
  const response = await userRepository.put(url, senderId);
  if (!response) {
    throw new Error("Failed to accept friend request");
  }
  return response;
};

// API từ chối lời mời kết bạn
export const rejectFriendRequestApi = async (
  senderId: string
): Promise<ResponseBase<null>> => {
  const url = `friendShip/delete-request?id=${senderId}`;
  const response = await userRepository.delete(url);
  if (!response) {
    throw new Error("Failed to delete friend request");
  }
  return response;
};

// API lấy thông tin hồ sơ người dùng
export const fetchUserProfileApi = async (
  userId?: string
): Promise<ResponseBase<ProfileUser>> => {
  const url = userId ? `/user/get-user?GetId=${userId}` : `/user/profile`;
  const response = await userRepository.get<ResponseBase<ProfileUser>>(url);
  if (!response) {
    throw new Error("Failed to fetch user profile");
  }
  return response;
};

// API lấy bài viết cá nhân
export const fetchPersonalPostsApi = async (
  userId?: string,
  cursor?: number | null,
  limit: number = 4
): Promise<ResponseBase<PaginatedCursorResult<Post>>> => {
  let url = userId
    ? `/post/personal?Id=${userId}&Limit=${limit}`
    : `/post/personal?Limit=${limit}`;
  if (cursor) {
    url += `&Cursor=${cursor}`;
  }
  const response = await userRepository.get<
    ResponseBase<PaginatedCursorResult<Post>>
  >(url);
  if (!response) {
    throw new Error("Failed to fetch personal posts");
  }
  return response;
};

// API thực hiện hành động (theo dõi, hủy theo dõi, gửi lời mời kết bạn, v.v.)
export const handleUserActionApi = async (
  apiEndpoint: string,
  method: "POST" | "DELETE",
  userId: string
): Promise<ResponseBase<null>> => {
  const response =
    method === "POST"
      ? await userRepository.post(apiEndpoint, userId)
      : await userRepository.delete(`${apiEndpoint}?id=${userId}`);
  if (!response) {
    throw new Error("Failed to perform user action");
  }
  return response;
};
