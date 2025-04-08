import authReducer from "@features/auth/authSlice";
import postsReducer from "@features/posts/postsSlice";
import categoryReducer from "@features/category/categorySlice";
import commentReducer from "@features/comments/commentSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    category: categoryReducer,
    comment: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
