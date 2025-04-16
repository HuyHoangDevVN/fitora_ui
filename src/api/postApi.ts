import { interactRepository } from "@/api/repository";
import { Post } from "@/types/post";
import { ResponseBase } from "@/types/responseBase";

const LIMIT = 4; // Số lượng bài viết mặc định mỗi lần lấy

//#region Interface

interface FetchPostsRequest {
  feedType: 1 | 2; // 1: All, 2: Category
  categoryId?: string; // Chỉ cần khi feedType là Category
  cursor?: string | null;
  limit?: number;
}

interface FetchPersonalPostsRequest {
  userId: number;
  cursor?: string | null;
  limit?: number;
}

interface VotePostRequest {
  userId: string;
  postId: string;
  voteType: 1 | 2 | 3; // 1: Upvote, 2: Downvote, 3: Unvote
}

//#region API
export const postApi = {
  // Lấy bài viết trên newfeed
  fetchPosts: async (
    request: FetchPostsRequest
  ): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
    const { feedType, categoryId, cursor, limit = LIMIT } = request;

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
    return response;
  },

  // Lấy bài viết cá nhân
  fetchPersonalPosts: async (
    request: FetchPersonalPostsRequest
  ): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
    const { userId, cursor, limit = LIMIT } = request;

    const queryParams: Record<string, any> = {
      Id: userId,
      Limit: limit,
    };

    if (cursor) {
      queryParams.Cursor = cursor;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `/post/personal?${queryString}`;

    const response = await interactRepository.get(url);
    return response;
  },

  // Thực hiện upvote hoặc downvote bài viết
  votePost: async (request: VotePostRequest): Promise<ResponseBase<null>> => {
    const url = `/post/vote`;
    const response = await interactRepository.put(url, request);
    return response;
  },
};
