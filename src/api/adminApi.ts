import { PrivacyPost } from "@/enums/post";
import { ReportStatus } from "@/enums/reportStatus";
import { TargetType } from "@/enums/targetType";
import { Account } from "@/types/account";
import { PaginatedResult } from "@/types/paginatedResult";
import { ResponseBase } from "@/types/responseBase";
import { Role } from "@/types/role";
import { notification } from "antd";
import {
  authRepository,
  interactRepository,
  userRepository,
} from "./repository";
import { GroupPrivacy, GroupStatus } from "@/enums/group";
import { Category } from "@/types/category";

export interface GetAccountsRequest {
  pageIndex: number;
  pageSize: number;
  keySearch?: string;
}
export interface GetRolesRequest {
  pageIndex: number;
  pageSize: number;
  keySearch?: string;
}

export interface AssignRoleRequest {
  roleNames: string[];
  email: string;
}

export interface UpdateRoleRequest {
  roleId: string;
  roleName: string;
}

export interface GetReportsRequest {
  pageIndex: number;
  pageSize: number;
  keySearch?: string;
  status?: ReportStatus;
  targetType?: TargetType;
  userId?: string;
}

export interface UpdateReportRequest {
  reportId: string;
  status: ReportStatus;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parentId?: string | null;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parentId?: string | null;
}

export interface GetCategoriesRequest {
  pageIndex: number;
  pageSize: number;
  keySearch?: string;
}

export interface GetPostsRequest {
  CategoryId?: string;
  UserId?: string;
  GroupId?: string;
  Privacy?: PrivacyPost;
  pageIndex: number;
  pageSize: number;
}

export interface GetCommentsRequest {
  userId?: string;
  postId: string;
  parentCommentId?: string;
  keySearch?: string;
  pageIndex: number;
  pageSize: number;
}

export interface GetGroupsRequest {
  keySearch?: string;
  privacy?: GroupPrivacy;
  status?: GroupStatus;
  pageIndex: number;
  pageSize: number;
}

export const adminApi = {
  // #region Check admin
  isAdmin: async (isNoti?: boolean) => {
    const url = "/admin/is-authorized";
    const response = await authRepository.get<ResponseBase<boolean>>(url, {
      suppressErrorNotification: isNoti,
    });
    if (!response) throw new Error("Failed to check admin status");
    return response;
  },

  // #region Account management
  getAccount: async (id: string) => {
    const url = `/admin/get-account?id=${id}`;
    const response = await authRepository.get<ResponseBase<Account>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy thông tin tài khoản" });
      throw new Error("Failed to fetch account");
    }
    return response;
  },

  getAccounts: async (request: GetAccountsRequest) => {
    const { pageIndex, pageSize, keySearch } = request;
    const url =
      `/admin/get-accounts?PageIndex=${pageIndex}&PageSize=${pageSize}` +
      (keySearch ? `&KeySearch=${encodeURIComponent(keySearch)}` : "");
    const response = await authRepository.get<
      ResponseBase<PaginatedResult<Account>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách tài khoản" });
      throw new Error("Failed to fetch accounts");
    }
    return response;
  },

  deleteAccount: async (id: string) => {
    const url = `/admin/delete-account?id=${id}`;
    const response = await authRepository.delete<ResponseBase<null>>(url);
    if (!response) {
      notification.error({ message: "Lỗi xoá tài khoản" });
      throw new Error("Failed to delete account");
    }
    return response;
  },

  updateAccount: async (account: Account) => {
    const url = `/admin/update-account`;
    const response = await authRepository.patch<ResponseBase<null>>(
      url,
      account
    );
    if (!response) {
      notification.error({ message: "Lỗi cập nhật tài khoản" });
      throw new Error("Failed to update account");
    }
    return response;
  },

  lockAccount: async (id: string) => {
    const url = `/admin/lock-account?id=${id}`;
    const response = await authRepository.post<ResponseBase<boolean>>(url);
    if (!response) {
      notification.error({ message: "Lỗi khoá tài khoản" });
      throw new Error("Failed to lock account");
    }
    return response;
  },

  unlockAccount: async (id: string) => {
    const url = `/admin/unlock-account?id=${id}`;
    const response = await authRepository.post<ResponseBase<boolean>>(url);
    if (!response) {
      notification.error({ message: "Lỗi mở khoá tài khoản" });
      throw new Error("Failed to unlock account");
    }
    return response;
  },

  // #region Role management
  getRoles: async (request: GetRolesRequest) => {
    const { pageIndex, pageSize, keySearch } = request;
    const url =
      `/admin/get-roles?PageIndex=${pageIndex}&PageSize=${pageSize}` +
      (keySearch ? `&KeySearch=${encodeURIComponent(keySearch)}` : "");
    const response = await authRepository.get<
      ResponseBase<PaginatedResult<Role>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách vai trò" });
      throw new Error("Failed to fetch roles");
    }
    return response;
  },

  getRole: async (id: string) => {
    const url = `/admin/get-role?id=${id}`;
    const response = await authRepository.get<ResponseBase<Role>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy thông tin vai trò" });
      throw new Error("Failed to fetch role");
    }
    return response;
  },

  createRole: async (roleName: string) => {
    const url = `/admin/create-role`;
    const response = await authRepository.post<ResponseBase<Role>>(url, {
      roleName,
    });
    if (!response) {
      notification.error({ message: "Lỗi tạo vai trò" });
      throw new Error("Failed to create role");
    }
    return response;
  },

  assignRole: async (request: AssignRoleRequest) => {
    const url = `/admin/assign-role`;
    const response = await authRepository.post<ResponseBase<null>>(
      url,
      request
    );
    if (!response) {
      notification.error({ message: "Lỗi gán vai trò" });
      throw new Error("Failed to assign role");
    }
    return response;
  },

  removeRole: async (request: AssignRoleRequest) => {
    const url = `/admin/remove-role`;
    const response = await authRepository.post<ResponseBase<null>>(
      url,
      request
    );
    if (!response) {
      notification.error({ message: "Lỗi xóa vai trò" });
      throw new Error("Failed to remove role");
    }
    return response;
  },

  updateRole: async (request: UpdateRoleRequest) => {
    const url = `/admin/update-role`;
    const response = await authRepository.put<ResponseBase<null>>(url, request);
    if (!response) {
      notification.error({ message: "Lỗi cập nhật vai trò" });
      throw new Error("Failed to update role");
    }
    return response;
  },

  deleteRole: async (name: string) => {
    const url = `/admin/delete-role?name=${name}`;
    const response = await authRepository.delete<ResponseBase<null>>(url);
    if (!response) {
      notification.error({ message: "Lỗi xoá vai trò" });
      throw new Error("Failed to delete role");
    }
    return response;
  },

  // #region Report management
  getReport: async (id: string) => {
    const url = `/admin/get-report?id=${id}`;
    const response = await interactRepository.get<ResponseBase<any>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy báo cáo" });
      throw new Error("Failed to fetch report");
    }
    return response;
  },

  getReports: async (request: GetReportsRequest) => {
    const { pageIndex, pageSize, keySearch, status, targetType, userId } =
      request;
    const url =
      `/admin/get-reports?PageIndex=${pageIndex}&PageSize=${pageSize}` +
      (keySearch ? `&KeySearch=${encodeURIComponent(keySearch)}` : "") +
      (status !== undefined ? `&Status=${status}` : "") +
      (targetType !== undefined ? `&TargetType=${targetType}` : "") +
      (userId ? `&UserId=${userId}` : "");
    const response = await interactRepository.get<
      ResponseBase<PaginatedResult<any>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách báo cáo" });
      throw new Error("Failed to fetch reports");
    }
    return response;
  },
  updateReport: async (request: UpdateReportRequest) => {
    const url = `/admin/update-report-status`;
    const response = await interactRepository.post<ResponseBase<null>>(
      url,
      request
    );
    if (!response) {
      notification.error({ message: "Lỗi cập nhật báo cáo" });
      throw new Error("Failed to update report");
    }
    return response;
  },
  deleteReport: async (id: string) => {
    const url = `/admin/delete-report?id=${id}`;
    const response = await interactRepository.delete<ResponseBase<null>>(url);
    if (!response) {
      notification.error({ message: "Lỗi xoá báo cáo" });
      throw new Error("Failed to delete report");
    }
    return response;
  },

  // #region Category management
  createCategory: async (request: CreateCategoryRequest) => {
    const url = `/admin/create-category`;
    const response = await interactRepository.post<ResponseBase<null>>(
      url,
      request
    );
    if (!response) {
      notification.error({ message: "Lỗi tạo danh mục" });
      throw new Error("Failed to create category");
    }
    return response;
  },
  getCateory: async (id: string) => {
    const url = `/admin/get-category?id=${id}`;
    const response = await interactRepository.get<ResponseBase<any>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh mục" });
      throw new Error("Failed to fetch category");
    }
    return response;
  },
  updateCategory: async (request: UpdateCategoryRequest) => {
    const url = `/admin/update-category`;
    const response = await interactRepository.put<ResponseBase<null>>(
      url,
      request
    );
    if (!response) {
      notification.error({ message: "Lỗi cập nhật danh mục" });
      throw new Error("Failed to update category");
    }
    return response;
  },
  getCategories: async (request: GetCategoriesRequest) => {
    const { pageIndex, pageSize, keySearch } = request;
    let url = `/admin/get-categories?PageIndex=${pageIndex}&PageSize=${pageSize}`;
    if (keySearch) {
      url += `&KeySearch=${encodeURIComponent(keySearch)}`;
    }
    const response = await interactRepository.get<
      ResponseBase<PaginatedResult<Category>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách danh mục" });
      throw new Error("Failed to fetch categories");
    }
    return response;
  },
  deleteCategory: async (id: string) => {
    const url = `/admin/delete-category?id=${id}`;
    const response = await interactRepository.delete<ResponseBase<null>>(url);
    if (!response) {
      notification.error({ message: "Lỗi xoá danh mục" });
      throw new Error("Failed to delete category");
    }
    return response;
  },

  // #region Post management
  getPost: async (id: string) => {
    const url = `/admin/get-post?id=${id}`;
    const response = await interactRepository.get<ResponseBase<any>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy bài viết" });
      throw new Error("Failed to fetch post");
    }
    return response;
  },

  getPosts: async (request: GetPostsRequest) => {
    const { CategoryId, UserId, GroupId, Privacy, pageIndex, pageSize } =
      request;
    const params: Record<string, string> = {
      PageIndex: pageIndex.toString(),
      PageSize: pageSize.toString(),
    };
    if (CategoryId) params.CategoryId = CategoryId;
    if (UserId) params.UserId = UserId;
    if (GroupId) params.GroupId = GroupId;
    if (Privacy !== undefined && Privacy !== null)
      params.Privacy = Privacy.toString();

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/admin/get-posts?${queryString}`;
    const response = await interactRepository.get<
      ResponseBase<PaginatedResult<any>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách bài viết" });
      throw new Error("Failed to fetch posts");
    }
    return response;
  },
  deletePost: async (id: string) => {
    const url = `/admin/delete-post?id=${id}`;
    const response = await interactRepository.delete<ResponseBase<null>>(url);
    if (!response) {
      notification.error({ message: "Lỗi xoá bài viết" });
      throw new Error("Failed to delete post");
    }
    return response;
  },

  // #region Comment management

  getComments: async (request: GetCommentsRequest) => {
    const { postId, pageIndex, pageSize, userId, parentCommentId, keySearch } =
      request;
    const params: Record<string, string> = {
      PostId: postId,
      PageIndex: pageIndex.toString(),
      PageSize: pageSize.toString(),
    };
    if (userId) params.UserId = userId;
    if (parentCommentId) params.ParentCommentId = parentCommentId;
    if (keySearch) params.KeySearch = keySearch;

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/admin/get-comments?${queryString}`;
    const response = await interactRepository.get<
      ResponseBase<PaginatedResult<any>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách bình luận" });
      throw new Error("Failed to fetch comments");
    }
    return response;
  },
  deleteComment: async (id: string) => {
    const url = `/admin/delete-comment?id=${id}`;
    const response = await interactRepository.delete<ResponseBase<null>>(url);
    if (!response) {
      notification.error({ message: "Lỗi xoá bình luận" });
      throw new Error("Failed to delete comment");
    }
    return response;
  },

  // #region Group management
  getGroup: async (id: string) => {
    const url = `/admin/get-group?id=${id}`;
    const response = await userRepository.get<ResponseBase<any>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy thông tin nhóm" });
      throw new Error("Failed to fetch group");
    }
    return response;
  },
  getGroups: async (request: GetGroupsRequest) => {
    const { keySearch, privacy, status, pageIndex, pageSize } = request;
    const url = `/admin/get-groups?KeySearch=${encodeURIComponent(
      keySearch || ""
    )}&Privacy=${privacy || ""}&Status=${
      status || ""
    }&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    const response = await userRepository.get<
      ResponseBase<PaginatedResult<any>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách nhóm" });
      throw new Error("Failed to fetch groups");
    }
    return response;
  },
  deleteGroup: async (id: string) => {
    const url = `/admin/delete-group?id=${id}`;
    const response = await userRepository.delete<ResponseBase<null>>(url);
    if (!response) {
      notification.error({ message: "Lỗi xoá nhóm" });
      throw new Error("Failed to delete group");
    }
    return response;
  },
};
