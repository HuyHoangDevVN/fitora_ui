import authReducer from "@features/auth/authSlice";
import postsReducer from "@features/posts/postsSlice";
import commentReducer from "@features/comments/commentSlice";
import userReducer from "@features/users/userSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comment: commentReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
