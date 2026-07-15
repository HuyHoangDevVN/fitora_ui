import { ReportStatus } from "@/enums/reportStatus";
import { TargetType } from "@/enums/targetType";

export interface Report {
  userId: string;
  targetType: TargetType;
  targetId: string;
  reason: string;
  status?: ReportStatus;
  hanldeBy?: string | null;
}
