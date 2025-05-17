// import { CreateGroupFormBody, groupApi } from "@/api/groupApi";
// import { GroupResponse } from "@/types/group";
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface GroupState {
//   groups: GroupResponse[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: GroupState = {
//   groups: [],
//   loading: false,
//   error: null,
// };

// // Async thunks
// export const createGroup = createAsyncThunk(
//   "groups/createGroup",
//   async (formBody: CreateGroupFormBody, { rejectWithValue }) => {
//     try {
//       const response = await groupApi.createGroup(formBody);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Lỗi khi tạo nhóm"
//       );
//     }
//   }
// );

// export const updateGroup = createAsyncThunk(
//   "groups/updateGroup",
//   async (
//     request: Parameters<typeof groupApi.updateGroup>[0],
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await groupApi.updateGroup(request);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Lỗi khi cập nhật nhóm"
//       );
//     }
//   }
// );

// export const deleteGroup = createAsyncThunk(
//   "groups/deleteGroup",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await groupApi.deleteGroup(id);
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Lỗi khi xóa nhóm"
//       );
//     }
//   }
// );

// // Slice
// const groupsSlice = createSlice({
//   name: "groups",
//   initialState,
//   reducers: {
//     resetGroupsState: (state) => {
//       Object.assign(state, initialState);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create group
//       .addCase(createGroup.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         createGroup.fulfilled,
//         (state, action: PayloadAction<GroupResponse>) => {
//           state.loading = false;
//           state.groups.push(action.payload);
//         }
//       )
//       .addCase(createGroup.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Update group
//       .addCase(updateGroup.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         updateGroup.fulfilled,
//         (state, action: PayloadAction<GroupResponse>) => {
//           state.loading = false;
//           const index = state.groups.findIndex(
//             (group) => group.id === action.payload.id
//           );
//           if (index !== -1) {
//             state.groups[index] = action.payload;
//           }
//         }
//       )
//       .addCase(updateGroup.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Delete group
//       .addCase(deleteGroup.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         deleteGroup.fulfilled,
//         (state, action: PayloadAction<string>) => {
//           state.loading = false;
//           state.groups = state.groups.filter(
//             (group) => group.id !== action.payload
//           );
//         }
//       )
//       .addCase(deleteGroup.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { resetGroupsState } = groupsSlice.actions;

// export default groupsSlice.reducer;
