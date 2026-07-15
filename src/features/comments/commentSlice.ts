import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { commentApi } from "@/api/commentApi";
import { PaginatedCursorResult } from "@/types/paginatedCrusorResult";
import { CommentResponse } from "@/types/post";

export interface CommentState {
  commentsByPost: {
    [postId: string]: PaginatedCursorResult<CommentResponse>;
  };
  repliesByComment: {
    [commentId: string]: PaginatedCursorResult<CommentResponse>;
  };
  loading: boolean;
  error: string | null;
}

export const initialState: CommentState = {
  commentsByPost: {},
  repliesByComment: {},
  loading: false,
  error: null,
};

// Thunk để lấy comments theo post
export const fetchCommentsByPost = createAsyncThunk(
  "comments/fetchByPost",
  async (
    request: {
      postId: string;
      userId: string;
      cursor?: string;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    const response = await commentApi.getCommentsByPost(request);
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch comments");
    }
    return {
      postId: request.postId,
      data: response.data.data,
      nextCursor: response.data.nextCursor,
    };
  }
);

// Thunk để lấy replies của comment
export const fetchCommentReplies = createAsyncThunk(
  "comments/fetchReplies",
  async (
    request: {
      parentCommentId: string;
      userId: string;
      cursor?: string;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    const response = await commentApi.getCommentReplies(request);
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch replies");
    }
    return {
      parentCommentId: request.parentCommentId,
      data: response.data.data,
      nextCursor: response.data.nextCursor,
    };
  }
);

// Thunk để tạo comment
export const createComment = createAsyncThunk(
  "comments/create",
  async (
    formBody: {
      postId: string;
      parentCommentId?: string;
      content: string;
      mediaUrl: string;
    },
    { rejectWithValue }
  ) => {
    const response = await commentApi.createComment(formBody);
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to create comment");
    }
    return response.data;
  }
);

// Thunk để vote comment
export const voteComment = createAsyncThunk(
  "comments/vote",
  async (
    request: {
      userId: string;
      commentId: string;
      voteType: 1 | 2 | 3; // 1: Upvote, 2: Downvote, 3: Unvote;
    },
    { rejectWithValue }
  ) => {
    const response = await commentApi.voteComment(request);
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to vote comment");
    }
    return response.data;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetCommentsByPost(state, action: PayloadAction<string>) {
      delete state.commentsByPost[action.payload];
    },
    resetRepliesByComment(state, action: PayloadAction<string>) {
      delete state.repliesByComment[action.payload];
    },
  },
  extraReducers: (builder) => {
    // Fetch comments by post
    builder
      .addCase(fetchCommentsByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data, nextCursor } = action.payload;
        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = {
            data: [],
            nextCursor: null,
            cursor: null,
            limit: 0,
            count: 0,
          };
        }
        const uniqueComments = data.filter(
          (comment) =>
            !state.commentsByPost[postId].data.some((c) => c.id === comment.id)
        );
        state.commentsByPost[postId].data.push(...uniqueComments);
        state.commentsByPost[postId].nextCursor = nextCursor
          ? Number(nextCursor)
          : null;
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch comment replies
    builder
      .addCase(fetchCommentReplies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentReplies.fulfilled, (state, action) => {
        state.loading = false;
        const { parentCommentId, data, nextCursor } = action.payload;
        if (!state.repliesByComment[parentCommentId]) {
          state.repliesByComment[parentCommentId] = {
            data: [],
            nextCursor: null,
            cursor: null,
            limit: 0,
            count: 0,
          };
        }
        const uniqueReplies = data.filter(
          (reply) =>
            !state.repliesByComment[parentCommentId].data.some(
              (r) => r.id === reply.id
            )
        );
        state.repliesByComment[parentCommentId].data.push(...uniqueReplies);
        state.repliesByComment[parentCommentId].nextCursor = nextCursor
          ? Number(nextCursor)
          : null;
      })
      .addCase(fetchCommentReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create comment
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const newComment = action.payload;
        if (newComment.parentCommentId) {
          // Nếu là reply
          if (!state.repliesByComment[newComment.parentCommentId]) {
            state.repliesByComment[newComment.parentCommentId] = {
              data: [],
              nextCursor: null,
              cursor: null,
              limit: 0,
              count: 0,
            };
          }
          state.repliesByComment[newComment.parentCommentId].data.unshift(
            newComment
          );
        } else {
          // Nếu là comment gốc
          if (!state.commentsByPost[newComment.postId]) {
            state.commentsByPost[newComment.postId] = {
              data: [],
              nextCursor: null,
              cursor: null,
              limit: 0,
              count: 0,
            };
          }
          state.commentsByPost[newComment.postId].data.unshift(newComment);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Vote comment
    builder
      .addCase(voteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComment = action.payload;
        const updateVotes = (comments: CommentResponse[]) => {
          const comment = comments.find((c) => c.id === updatedComment.id);
          if (comment) {
            comment.votes = updatedComment.votes;
            comment.userVoteType = updatedComment.userVoteType;
          }
        };
        // Cập nhật votes trong commentsByPost
        Object.values(state.commentsByPost).forEach((postComments) =>
          updateVotes(postComments.data)
        );
        // Cập nhật votes trong repliesByComment
        Object.values(state.repliesByComment).forEach((commentReplies) =>
          updateVotes(commentReplies.data)
        );
      })
      .addCase(voteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCommentsByPost, resetRepliesByComment } =
  commentSlice.actions;
export default commentSlice.reducer;
