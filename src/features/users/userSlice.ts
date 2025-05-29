import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetListFriendsRequest, userApi } from "@/api/userApi";
import { ProfileUser } from "@/types/profileUser";
import { notification } from "antd";
import { FriendInvite } from "@/types/friendInvite";
import { User } from "@/types/user";

export interface UserState {
  profile: ProfileUser | null;
  loading: boolean;
  error: string | null;
  friendInvitations: FriendInvite[]; // New state for friend invitations
  contacts: User[]; // New state for contact list
}

export const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  friendInvitations: [], // Initialize as empty array
  contacts: [], // Initialize as empty array
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await userApi.fetchUserProfile(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user profile");
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "user/acceptFriendRequest",
  async (senderId: string, { rejectWithValue }) => {
    try {
      const response = await userApi.acceptFriendRequest(senderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to accept friend request"
      );
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "user/rejectFriendRequest",
  async (senderId: string, { rejectWithValue }) => {
    try {
      const response = await userApi.rejectFriendRequest(senderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to reject friend request"
      );
    }
  }
);

export const fetchFriendInvitations = createAsyncThunk(
  "user/fetchFriendInvitations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getFriendInvitations();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch friend invitations"
      );
    }
  }
);

export const fetchFriends = createAsyncThunk(
  "user/fetchFriends",
  async (request: GetListFriendsRequest, { rejectWithValue }) => {
    try {
      const response = await userApi.getListFriends(request);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch contacts");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        if (action.payload?.userInfo) {
          localStorage.setItem(
            "userInfo",
            JSON.stringify(action.payload.userInfo)
          );
        }
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.profile = null; // Clear profile on error
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state) => {
        state.loading = false;
        notification.success({
          message: "Friend request accepted",
          description: "You have successfully accepted the friend request.",
        });
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        notification.error({
          message: "Failed to accept friend request",
          description: action.payload as string,
        });
      })
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state) => {
        state.loading = false;
        notification.success({
          message: "Friend request rejected",
          description: "You have successfully rejected the friend request.",
        });
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        notification.error({
          message: "Failed to reject friend request",
          description: action.payload as string,
        });
      })
      .addCase(fetchFriendInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendInvitations.fulfilled, (state, action) => {
        state.friendInvitations = action.payload;
        state.loading = false;
      })
      .addCase(fetchFriendInvitations.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.loading = false;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;
