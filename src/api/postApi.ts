import { interactRepository } from "@/api/repository";
import { ResponseBase } from "@/types/responseBase";
import { Post } from "@/types/post";

const LIMIT = 4;

// API để lấy bài viết trên newfeed
export const fetchPostsApi = async (
  cursor: number | null = null
): Promise<ResponseBase<{ data: Post[]; nextCursor: number | null }>> => {
  let url = `/post/newfeed?Limit=${LIMIT}`;
  if (cursor !== null) {
    url += `&Cursor=${cursor}`;
  }
  const response = await interactRepository.get(url);
  if (!response) {
    throw new Error("Failed to fetch data from the repository.");
  }
  return response;
};

// API để lấy bài viết cá nhân
export const fetchPersonalPostsApi = async (
  userId: number,
  cursor: number | null = null
): Promise<ResponseBase<{ data: Post[]; nextCursor: number | null }>> => {
  let url = `/post/personal?Id=${userId}&Limit=${LIMIT}`;
  if (cursor !== null) {
    url += `&Cursor=${cursor}`;
  }
  const response = await interactRepository.get(url);
  if (!response) {
    throw new Error("Failed to fetch data from the repository.");
  }
  return response;
};

// API để thực hiện upvote hoặc downvote bài viết
export const votePostApi = async (
  userId: string,
  postId: string,
  voteType: 1 | 2 | 3 // 1: Upvote, 2: Downvote, 3: Unvote
): Promise<ResponseBase<null>> => {
  const url = `/post/vote`;
  const payload = {
    userId,
    postId,
    voteType,
  };
  const response = await interactRepository.put(url, payload);
  if (!response) {
    throw new Error("Failed to vote on the post.");
  }
  return response;
};
