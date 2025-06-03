import { TargetType } from "@/enums/targetType";
import { ResponseBase } from "@/types/responseBase";
import { interactRepository } from "./repository";

interface CreateReportRequest {
  targetType: TargetType;
  targetId: string;
  reason: string;
}

export const interactApi = {
  createReport: async (
    request: CreateReportRequest
  ): Promise<ResponseBase<null>> => {
    const url = `/report/create`;
    const response = await interactRepository.post(url, request);
    if (!response) {
      throw new Error("Failed to create report");
    }
    return response;
  },
};
