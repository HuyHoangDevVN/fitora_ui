import { interactRepository } from "@/api/repository";
import { CommentResponse } from "@/types/post";
import { ResponseBase } from "@/types/responseBase";

const LIMIT = 10; // Số lượng comment mặc định mỗi lần lấy

// Interfaces
interface CreateCommentFormBody {
  postId: string;
  parentCommentId?: string;
  content: string;
  mediaUrl: string;
}

interface UpdateCommentRequest {
  id: string;
  content: string;
  mediaUrl: string;
}

interface VoteCommentRequest {
  userId: string;
  commentId: string;
  voteType: 1 | 2 | 3; // 1: Upvote, 2: Downvote, 3: Unvote;
}

interface GetPostCommentsRequest {
  userId: string;
  postId: string;
  cursor?: string;
  limit?: number;
}

interface GetCommentRepliesRequest {
  userId: string;
  parentCommentId: string;
  cursor?: string;
  limit?: number;
}

// Interfaces
interface VoteCommentRequest {
  userId: string;
  commentId: string;
  voteType: 1 | 2 | 3; // 1: Upvote, 2: Downvote, 3: Unvote
}

// API
export const commentApi = {
  // Tạo comment
  createComment: async (
    formBody: CreateCommentFormBody
  ): Promise<ResponseBase<CommentResponse>> => {
    const url = `/comment/create`;
    const response = await interactRepository.post(url, formBody);
    return response;
  },

  // Cập nhật comment
  updateComment: async (
    request: UpdateCommentRequest
  ): Promise<ResponseBase<CommentResponse>> => {
    const url = `/comment/update`;
    const response = await interactRepository.put(url, request);
    return response;
  },

  // Xóa comment
  deleteComment: async (id: string): Promise<ResponseBase<null>> => {
    const url = `/comment/delete?id=${id}`;
    const response = await interactRepository.delete(url);
    return response;
  },

  // Vote comment
  voteComment: async (
    request: VoteCommentRequest
  ): Promise<ResponseBase<CommentResponse>> => {
    const url = `/comment/vote`;
    const response = await interactRepository.put(url, request);
    return response;
  },

  // Lấy comment theo post
  getCommentsByPost: async (
    request: GetPostCommentsRequest
  ): Promise<
    ResponseBase<{ data: CommentResponse[]; nextCursor: string | null }>
  > => {
    const { userId, postId, cursor, limit = LIMIT } = request;

    const queryParams: Record<string, any> = {
      UserId: userId,
      PostId: postId,
      Limit: limit,
    };

    if (cursor) {
      queryParams.Cursor = cursor;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `/comment/get-by-post?${queryString}`;

    const response = await interactRepository.get(url);
    return response;
  },

  // Lấy replies của comment
  getCommentReplies: async (
    request: GetCommentRepliesRequest
  ): Promise<
    ResponseBase<{ data: CommentResponse[]; nextCursor: string | null }>
  > => {
    const { userId, parentCommentId, cursor, limit = LIMIT } = request;

    const queryParams: Record<string, any> = {
      UserId: userId,
      ParentCommentId: parentCommentId,
      Limit: limit,
    };

    if (cursor) {
      queryParams.Cursor = cursor;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = `/comment/get-replies?${queryString}`;

    const response = await interactRepository.get(url);
    return response;
  },
};
