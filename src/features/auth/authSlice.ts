import {
  getUserInfo,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "@/api/authApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

export interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  userInfo: any | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: !!localStorage.getItem("isLoggedIn"), // Lấy trạng thái từ localStorage
  loading: false,
  userInfo: null,
  error: null,
};

// Kiểm tra trạng thái đăng nhập
export const checkLoginStatus = createAsyncThunk(
  "auth/checkLoginStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserInfo();
      if (response?.isSuccess) {
        return true; // Chỉ trả về trạng thái đăng nhập
      } else {
        return rejectWithValue("Not logged in");
      }
    } catch (error) {
      return rejectWithValue("Error checking login status");
    }
  }
);

// Đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUser(username, password);
      if (response?.isSuccess) {
        return response.user;
      } else {
        return rejectWithValue(response?.message || "Login failed");
      }
    } catch (error) {
      return rejectWithValue("Login error");
    }
  }
);

// Đăng ký
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
      if (response?.isSuccess) {
        return { username, password };
      } else {
        return rejectWithValue(response?.message || "Registration failed");
      }
    } catch (error) {
      return rejectWithValue("Registration error");
    }
  }
);

// Đăng xuất
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return;
    } catch (error) {
      return rejectWithValue("Logout error");
    }
  }
);

// Làm mới token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      await refreshAccessToken();
      return;
    } catch (error) {
      return rejectWithValue("Token refresh error");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null; // Xóa lỗi
    },
  },
  extraReducers: (builder) => {
    builder
      // Kiểm tra trạng thái đăng nhập
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
        state.userInfo = null; // Xóa thông tin người dùng nếu không đăng nhập
        state.loading = false;
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userInfo");
      })
      // Đăng nhập
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.userInfo = action.payload;
        state.loading = false;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
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
      // Đăng ký
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
      // Đăng xuất
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
      // Làm mới token
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
