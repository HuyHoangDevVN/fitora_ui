import { ResponseBase } from "@/types/responseBase";
import { authRepository } from "./repository";
import { PaginatedResult } from "@/types/paginatedResult";
import { Account } from "@/types/account";
import { notification } from "antd";
import { Role } from "@/types/role";

export interface GetAccountsRequest {
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

export const adminApi = {
  // Check admin authorization
  isAdmin: async (isNoti?: boolean) => {
    const url = "/admin/is-authorized";
    const response = await authRepository.get<ResponseBase<boolean>>(url, {
      suppressErrorNotification: isNoti,
    });
    if (!response) {
      throw new Error("Failed to check admin status");
    }
    return response.data;
  },
  //#region  Account management
  getAccount: async (id: string) => {
    const url = `/admin/get-account?id=${id}`;
    const response = await authRepository.get<ResponseBase<Account>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy thông tin tài khoản" });
      throw new Error("Failed to fetch account");
    }
    return response.data;
  },
  getAccounts: async (request: GetAccountsRequest) => {
    const { pageIndex, pageSize, keySearch } = request;
    const url = `/admin/get-accounts?PageIndex=${pageIndex}&PageSize=${pageSize}${
      keySearch ? `&KeySearch=${encodeURIComponent(keySearch)}` : ""
    }`;
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
  //#region Role management
  getRoles: async () => {
    const url = `/admin/get-roles`;
    const response = await authRepository.get<
      ResponseBase<PaginatedResult<Role>>
    >(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy danh sách vai trò" });
      throw new Error("Failed to fetch roles");
    }
    return response.data;
  },
  getRole: async (roleId: string) => {
    const url = `/admin/get-role?roleId=${roleId}`;
    const response = await authRepository.get<ResponseBase<Role>>(url);
    if (!response) {
      notification.error({ message: "Lỗi lấy thông tin vai trò" });
      throw new Error("Failed to fetch role");
    }
    return response.data;
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
};
