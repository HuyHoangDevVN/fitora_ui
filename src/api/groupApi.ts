import { GroupPrivacy } from "@/enums/group";
import { ResponseBase } from "@/types/responseBase";
import { interactRepository } from "./repository";
import { GroupResponse } from "@/types/group";

//#region Interface
export interface CreateGroupFormBody {
  Name: string;
  Description: string;
  Privacy: GroupPrivacy;
  RequirePostApproval: boolean;
  CoverImageUrl?: string;
  AvatarUrl?: string;
}

export interface UpdateGroupRequest {
  Id: string;
  Name: string;
  Description: string;
  Privacy: GroupPrivacy;
  RequirePostApproval: boolean;
  CoverImageUrl?: string;
  AvatarUrl?: string;
}

//#region API
export const groupApi = {
  // Tạo nhóm
  createGroup: async (
    formBody: CreateGroupFormBody
  ): Promise<ResponseBase<GroupResponse>> => {
    const url = `/group/create`;
    const response = await interactRepository.post(url, formBody);
    return response;
  },

  // Cập nhật nhóm
  updateGroup: async (
    request: UpdateGroupRequest
  ): Promise<ResponseBase<GroupResponse>> => {
    const url = `/group/update`;
    const response = await interactRepository.put(url, request);
    return response;
  },

  // Xóa nhóm
  deleteGroup: async (id: string): Promise<ResponseBase<null>> => {
    const url = `/group/delete?id=${id}`;
    const response = await interactRepository.delete(url);
    return response;
  },
};
