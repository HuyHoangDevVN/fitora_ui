import { Modal, Select } from "antd";
import { ReportStatus } from "@/enums/reportStatus";

interface ReportUpdateStatusModalProps {
  open: boolean;
  status: ReportStatus;
  onChange: (status: ReportStatus) => void;
  onClose: () => void;
}

const ReportUpdateStatusModal = ({
  open,
  status,
  onChange,
  onClose,
}: ReportUpdateStatusModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Cập nhật trạng thái báo cáo
        </span>
      }
    >
      <Select
        value={status}
        style={{ minWidth: 180 }}
        onChange={onChange}
        options={[
          { value: ReportStatus.Pending, label: "Chờ xử lý" },
          { value: ReportStatus.InProgress, label: "Đang xử lý" },
          { value: ReportStatus.Resolved, label: "Đã giải quyết" },
          { value: ReportStatus.Closed, label: "Đã đóng" },
          { value: ReportStatus.Rejected, label: "Từ chối" },
          { value: ReportStatus.Archived, label: "Đã lưu trữ" },
        ]}
      />
    </Modal>
  );
};

export default ReportUpdateStatusModal;
