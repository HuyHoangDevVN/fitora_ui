import { Modal, Select } from "antd";
import { Report } from "@/types/report";
import { ReportStatus } from "@/enums/reportStatus";
import { TargetType } from "@/enums/targetType";

interface ReportViewModalProps {
  open: boolean;
  report: Report | null;
  onClose: () => void;
  onUpdateStatus: (status: ReportStatus) => void;
}

const ReportViewModal = ({
  open,
  report,
  onClose,
  onUpdateStatus,
}: ReportViewModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Chi tiết báo cáo
        </span>
      }
    >
      {report && (
        <div className="flex flex-col gap-4">
          <div>
            <b>Người báo cáo:</b> {report.userId}
          </div>
          <div>
            <b>Loại đối tượng:</b>{" "}
            {report.targetType === TargetType.Comment
              ? "Bình luận"
              : report.targetType === TargetType.Post
              ? "Bài viết"
              : "Khác"}
          </div>
          <div>
            <b>ID đối tượng:</b> {report.targetId}
          </div>
          <div>
            <b>Lý do:</b> {report.reason}
          </div>
          <div>
            <b>Trạng thái:</b>{" "}
            {(() => {
              switch (report.status) {
                case ReportStatus.Pending:
                  return "Chờ xử lý";
                case ReportStatus.InProgress:
                  return "Đang xử lý";
                case ReportStatus.Resolved:
                  return "Đã giải quyết";
                case ReportStatus.Closed:
                  return "Đã đóng";
                case ReportStatus.Rejected:
                  return "Từ chối";
                case ReportStatus.Archived:
                  return "Đã lưu trữ";
                default:
                  return "-";
              }
            })()}
          </div>
          <div className="flex gap-2 mt-2">
            <Select
              value={report.status}
              style={{ minWidth: 120 }}
              onChange={onUpdateStatus}
              options={[
                { value: ReportStatus.Pending, label: "Chờ xử lý" },
                { value: ReportStatus.InProgress, label: "Đang xử lý" },
                { value: ReportStatus.Resolved, label: "Đã giải quyết" },
                { value: ReportStatus.Closed, label: "Đã đóng" },
                { value: ReportStatus.Rejected, label: "Từ chối" },
                { value: ReportStatus.Archived, label: "Đã lưu trữ" },
              ]}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReportViewModal;
