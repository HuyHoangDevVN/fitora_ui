import { interactRepository } from "@/api/repository";
import { Post } from "@/types/post";
import { ResponseBase } from "@/types/responseBase";

const LIMIT = 5; // Số lượng bài viết mặc định mỗi lần lấy

//#region Interface

interface FetchPostsRequest {
  keySearch?: string; // Từ khóa tìm kiếm
  groupId?: string;
  feedType: 1 | 2; // 1: All, 2: Category
  categoryId?: string; // Chỉ cần khi feedType là Category
  cursor?: string | null;
  limit?: number;
}

interface FetchPersonalPostsRequest {
  userId: number;
  isFriend?: boolean;
  cursor?: string | null;
  limit?: number;
}

interface VotePostRequest {
  userId: string;
  postId: string;
  voteType: 1 | 2 | 3; // 1: Upvote, 2: Downvote, 3: Unvote
}

interface SavePostRequest {
  userId: string;
  postId: string;
}

interface FetchTrendingPostsRequest {
  cursor?: string | null;
  limit?: number;
}

interface FetchSavedPostsRequest {
  cursor?: string | null;
  limit?: number;
}

interface FetchExplorePostsRequest {
  cursor?: string | null;
  limit?: number;
}

//#region API
export const postApi = {
  // Lấy bài viết trên newfeed
  fetchPosts: async (
    request: FetchPostsRequest
  ): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
    const { categoryId, keySearch } = request;
    const {
      groupId,
      feedType: originalFeedType,
      cursor,
      limit = LIMIT,
    } = request;

    const feedType = groupId ? 1 : originalFeedType; // Nếu có groupId thì feedType luôn bằng 1

    const queryParams: Record<string, any> = {
      FeedType: feedType,
      Limit: limit,
    };

    if (cursor) {
      queryParams.Cursor = cursor;
    }

    if (groupId) {
      queryParams.GroupId = groupId;
    }

    if (feedType === 2 && categoryId) {
      queryParams.CategoryId = categoryId;
    }

    if (keySearch) {
      queryParams.KeySearch = keySearch;
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
    const { userId, isFriend, cursor, limit = LIMIT } = request;

    const queryParams: Record<string, any> = {
      Id: userId,
      IsFriend: isFriend,
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

  // Lấy bài viết thịnh hành
  fetchTrendingPosts: async (
    request: FetchTrendingPostsRequest
  ): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
    const { cursor, limit = LIMIT } = request;

    const queryParams: Record<string, any> = {
      Limit: limit,
    };

    if (cursor) {
      queryParams.Cursor = cursor;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `/post/trending-feed?${queryString}`;

    const response = await interactRepository.get(url);
    return response;
  },

  // Lấy bài viết thịnh hành
  fetchSavedPosts: async (
    request: FetchSavedPostsRequest
  ): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
    const { cursor, limit = LIMIT } = request;

    const queryParams: Record<string, any> = {
      Limit: limit,
    };

    if (cursor) {
      queryParams.Cursor = cursor;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `/post/saved-posts?${queryString}`;

    const response = await interactRepository.get(url);
    return response;
  },

  // Lấy bài viết khám phá
  fetchExplorePosts: async (
    request: FetchExplorePostsRequest
  ): Promise<ResponseBase<{ data: Post[]; nextCursor: string | null }>> => {
    const { cursor, limit = LIMIT } = request;

    const queryParams: Record<string, any> = {
      Limit: limit,
    };

    if (cursor) {
      queryParams.Cursor = cursor;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `/post/explore-feed?${queryString}`;

    const response = await interactRepository.get(url);
    return response;
  },

  // Thực hiện upvote hoặc downvote bài viết
  votePost: async (request: VotePostRequest): Promise<ResponseBase<any>> => {
    const url = `/post/vote`;
    const response = await interactRepository.put(url, request);
    return response;
  },

  // Thực hiện upvote hoặc downvote bài viết
  savePost: async (request: SavePostRequest): Promise<ResponseBase<any>> => {
    const url = `/post/save-post`;
    const response = await interactRepository.post(url, request);
    return response;
  },

  // Thực hiện upvote hoặc downvote bài viết
  unSavePost: async (postId: string): Promise<ResponseBase<any>> => {
    const url = `/post/unsave-post?postId=${postId}`;
    const response = await interactRepository.delete(url);
    return response;
  },
};
