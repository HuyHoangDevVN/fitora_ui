import { interactRepository } from "@/api/repository";
import { Post } from "@/types/post";
import { ResponseBase } from "@/types/responseBase";

const LIMIT = 4;

// API để lấy bài viết trên newfeed
export const fetchPostsApi = async (params: {
  feedType: 1 | 2; // 1: All, 2: Category
  categoryId?: string; // Chỉ cần khi feedType là Category
  cursor?: string | null;
  limit?: number;
}): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
  const { feedType, categoryId, cursor, limit = LIMIT } = params;

  // Xây dựng query string
  const queryParams: Record<string, any> = {
    FeedType: feedType,
    Limit: limit,
  };

  if (cursor) {
    queryParams.Cursor = cursor;
  }

  if (feedType === 2 && categoryId) {
    queryParams.CategoryId = categoryId;
  }

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `/post/newfeed?${queryString}`;

  const response = await interactRepository.get(url);
  if (!response) {
    throw new Error("Failed to fetch data from the repository.");
  }
  return response;
};

// API để lấy bài viết cá nhân
export const fetchPersonalPostsApi = async (
  userId: number,
  cursor: string | null = null
): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
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
