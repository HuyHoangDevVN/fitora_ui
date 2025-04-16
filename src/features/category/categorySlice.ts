import { categoryApi } from "@/api/categoryApi";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  id: string;
  name: string;
  [key: string]: any;
}

interface CategoryState {
  categoriesForNewfeed: Category[]; // Dùng cho Home
  categoriesForPost: Category[]; // Dùng cho CreatePost
  followedCategories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categoriesForNewfeed: [],
  categoriesForPost: [],
  followedCategories: [],
  loading: false,
  error: null,
};

// Fetch categories for newfeed (followed + trending)
export const fetchCategoriesForNewfeed = createAsyncThunk(
  "category/fetchCategoriesForNewfeed",
  async (_, { rejectWithValue }) => {
    try {
      const followed = await categoryApi.fetchFollowedCategories();
      const trending = await categoryApi.fetchTrendingCategories({
        limit: 10,
      });
      return { followed, trending };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Fetch categories for post creation (searchable)
export const fetchCategoriesForPost = createAsyncThunk(
  "category/fetchCategoriesForPost",
  async (keySearch: string | undefined, { rejectWithValue }) => {
    try {
      return await categoryApi.fetchCategories(keySearch);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Create a new category
export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData: any, { rejectWithValue }) => {
    try {
      return await categoryApi.createCategory(categoryData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Follow a category
export const followCategory = createAsyncThunk(
  "category/follow",
  async (id: string, { rejectWithValue }) => {
    try {
      return await categoryApi.followCategory(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Unfollow a category
export const unfollowCategory = createAsyncThunk(
  "category/unfollow",
  async (id: string, { rejectWithValue }) => {
    try {
      return await categoryApi.unfollowCategory(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Helper functions for handling states
const handlePending = (state: CategoryState) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = <T, K extends keyof CategoryState>(
  state: CategoryState,
  action: PayloadAction<T>,
  key: K
) => {
  state.loading = false;
  state[key] = action.payload as CategoryState[K];
};

const handleRejected = (state: CategoryState, action: PayloadAction<any>) => {
  state.loading = false;
  state.error = action.payload;
};

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories for newfeed
      .addCase(fetchCategoriesForNewfeed.pending, handlePending)
      .addCase(fetchCategoriesForNewfeed.fulfilled, (state, action) => {
        state.loading = false;
        const { followed, trending } = action.payload;
        state.categoriesForNewfeed = [...followed, ...trending];
        state.followedCategories = followed;
      })
      .addCase(fetchCategoriesForNewfeed.rejected, handleRejected)
      // Fetch categories for post creation
      .addCase(fetchCategoriesForPost.pending, handlePending)
      .addCase(fetchCategoriesForPost.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesForPost = action.payload;
      })
      .addCase(fetchCategoriesForPost.rejected, handleRejected)
      // Create category
      .addCase(createCategory.pending, handlePending)
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesForNewfeed.push(action.payload);
      })
      .addCase(createCategory.rejected, handleRejected)
      // Follow category
      .addCase(followCategory.pending, handlePending)
      .addCase(followCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.followedCategories.push(action.payload);
      })
      .addCase(followCategory.rejected, handleRejected)
      // Unfollow category
      .addCase(unfollowCategory.pending, handlePending)
      .addCase(unfollowCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.followedCategories = state.followedCategories.filter(
          (category) => category.id !== action.payload.id
        );
      })
      .addCase(unfollowCategory.rejected, handleRejected);
  },
});

export default categorySlice.reducer;
