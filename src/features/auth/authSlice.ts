import {
  getUserInfo,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "@/api/authApi";
import { userApi } from "@/api/userApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

export interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  userInfo: any | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: !!localStorage.getItem("isLoggedIn"),
  loading: false,
  userInfo: null,
  error: null,
};

export const checkLoginStatus = createAsyncThunk(
  "auth/checkLoginStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserInfo();
      return response?.isSuccess ? true : rejectWithValue("Not logged in");
    } catch {
      return rejectWithValue("Error checking login status");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUser(username, password);
      if (response?.isSuccess) {
        const fetchProfile = await userApi.fetchUserProfile();
        if (fetchProfile?.isSuccess) return response.user;
        return rejectWithValue(fetchProfile?.message || "Fetch profile failed");
      }
      return rejectWithValue(response?.message || "Login failed");
    } catch {
      return rejectWithValue("Login error");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      password,
      fullname,
    }: { username: string; password: string; fullname: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUser(username, password, fullname);
      return response?.isSuccess
        ? { username, password }
        : rejectWithValue(response?.message || "Registration failed");
    } catch {
      return rejectWithValue("Registration error");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch {
      return rejectWithValue("Logout error");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      await refreshAccessToken();
    } catch {
      return rejectWithValue("Token refresh error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkLoginStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkLoginStatus.fulfilled, (state) => {
        state.isLoggedIn = true;
        state.loading = false;
        localStorage.setItem("isLoggedIn", "true");
      })
      .addCase(checkLoginStatus.rejected, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.loading = false;
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userInfo");
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.userInfo = action.payload;
        state.loading = false;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("x-client-id", action.payload.id);
        notification.success({
          message: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.loading = false;
        state.error = action.payload as string;
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userInfo");
        notification.error({
          message: "Đăng nhập thất bại",
          description: action.payload as string,
        });
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        notification.success({
          message: "Đăng ký thành công",
          description: "Bạn sẽ được đăng nhập tự động!",
        });
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        notification.error({
          message: "Đăng ký thất bại",
          description: action.payload as string,
        });
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        localStorage.clear();
        notification.info({
          message: "Đăng xuất",
          description: "Bạn đã đăng xuất thành công.",
        });
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
        notification.error({
          message: "Đăng xuất thất bại",
          description: action.payload as string,
        });
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.isLoggedIn = true;
        localStorage.setItem("isLoggedIn", "true");
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoggedIn = false;
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userInfo");
        notification.error({
          message: "Phiên làm việc hết hạn",
          description: "Vui lòng đăng nhập lại.",
        });
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
