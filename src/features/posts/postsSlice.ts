import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Post } from "@/types/post";
import { postApi } from "@/api/postApi";

export interface PostsState {
  posts: Post[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  nextCursor: string | null;
  hasMore: boolean;
  errorCount: number;
}

export const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: null,
  nextCursor: null,
  hasMore: true,
  errorCount: 0,
};

// Fetch bài viết trên newfeed
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    params: {
      feedType: 1 | 2;
      categoryId?: string;
      cursor?: string | null;
      limit?: number;
    },
    thunkAPI
  ) => {
    try {
      if (
        !params.feedType ||
        (params.feedType !== 1 && params.feedType !== 2)
      ) {
        return thunkAPI.rejectWithValue("Loại feed không hợp lệ");
      }

      const response = await postApi.fetchPosts(params);
      if (!response.isSuccess) {
        return thunkAPI.rejectWithValue(
          response.message || "Không thể tải bài viết"
        );
      }

      if (!response.data || !Array.isArray(response.data.data)) {
        return thunkAPI.rejectWithValue("Dữ liệu bài viết không hợp lệ");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return thunkAPI.rejectWithValue("Có lỗi xảy ra khi tải bài viết");
    }
  }
);

// Fetch bài viết cá nhân
export const fetchPersonalPosts = createAsyncThunk(
  "posts/fetchPersonalPosts",
  async (
    {
      userId,
      isFriend,
      cursor,
    }: { userId: number; isFriend?: boolean; cursor?: string | null },
    thunkAPI
  ) => {
    try {
      const response = await postApi.fetchPersonalPosts({
        userId,
        isFriend,
        cursor,
      });
      if (!response.isSuccess) {
        return thunkAPI.rejectWithValue(
          response.message || "Không thể tải bài viết cá nhân"
        );
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Có lỗi xảy ra khi tải bài viết cá nhân");
    }
  }
);

// Vote hoặc unvote bài viết
export const votePost = createAsyncThunk(
  "posts/votePost",
  async (
    {
      userId,
      postId,
      voteType,
    }: { userId: string; postId: string; voteType: 1 | 2 | 3 },
    thunkAPI
  ) => {
    try {
      const response = await postApi.votePost({ userId, postId, voteType });
      if (!response.isSuccess) {
        return thunkAPI.rejectWithValue(
          response.message || "Không thể thực hiện hành động vote"
        );
      }
      return { postId, voteType };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        "Có lỗi xảy ra khi thực hiện hành động vote"
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost(state, action: { payload: Post }) {
      state.posts.push(action.payload);
    },
    resetPosts(state) {
      state.posts = [];
      state.status = "idle";
      state.error = null;
      state.nextCursor = null;
      state.hasMore = true;
      state.errorCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { data, nextCursor } = action.payload;
        const uniquePosts = data.filter(
          (post: Post) => !state.posts.some((p) => p.id === post.id)
        );
        state.posts = [...state.posts, ...uniquePosts];
        state.nextCursor = nextCursor;
        state.hasMore = nextCursor !== null;
        state.errorCount = 0;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || action.error.message || "Có lỗi xảy ra";
        state.errorCount += 1;
      })
      .addCase(fetchPersonalPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPersonalPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { data, nextCursor } = action.payload;
        const uniquePosts = data.filter(
          (post: Post) => !state.posts.some((p) => p.id === post.id)
        );
        state.posts = [...state.posts, ...uniquePosts];
        state.nextCursor = nextCursor;
        state.hasMore = nextCursor !== null;
        state.errorCount = 0;
      })
      .addCase(fetchPersonalPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || action.error.message || "Có lỗi xảy ra";
        state.errorCount += 1;
      })
      .addCase(votePost.fulfilled, (state, action) => {
        const { postId, voteType } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          if (voteType === 3) {
            if (post.userVoteType === 1) post.votesCount -= 1;
            if (post.userVoteType === 2) post.votesCount += 1;
            post.userVoteType = null;
          } else if (post.userVoteType === voteType) {
            post.userVoteType = null;
            post.votesCount += voteType === 1 ? -1 : 1;
          } else {
            if (post.userVoteType === 1) post.votesCount -= 1;
            if (post.userVoteType === 2) post.votesCount += 1;
            post.userVoteType = voteType;
            post.votesCount += voteType === 1 ? 1 : -1;
          }
        }
      })
      .addCase(votePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addPost, resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
