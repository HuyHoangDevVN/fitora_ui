import React, { useState } from "react";
import { Modal, Checkbox, Input, Button, notification } from "antd";
import { interactApi } from "@/api/interactApi";
import { TargetType } from "@/enums/targetType";

const REASONS_MAP: Record<TargetType, string[]> = {
  [TargetType.Post]: [
    "Nội dung không phù hợp",
    "Spam/quảng cáo",
    "Quấy rối/lạm dụng",
    "Thông tin sai sự thật",
    "Vi phạm bản quyền",
    "Khác",
  ],
  [TargetType.Comment]: [
    "Bình luận không phù hợp",
    "Spam/quảng cáo",
    "Ngôn từ kích động/thù địch",
    "Thông tin sai sự thật",
    "Khác",
  ],
  [TargetType.User]: [
    "Tài khoản giả mạo",
    "Quấy rối/lạm dụng",
    "Spam/tin nhắn rác",
    "Chia sẻ nội dung không phù hợp",
    "Khác",
  ],
  [TargetType.Group]: [
    "Nội dung nhóm không phù hợp",
    "Spam/quảng cáo",
    "Nhóm giả mạo",
    "Khác",
  ],
};

interface ReportModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  targetType: TargetType;
  targetId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  open,
  onCancel,
  onSuccess,
  targetType,
  targetId,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = REASONS_MAP[targetType] || ["Khác"];

  const handleReasonChange = (checkedValues: any) => {
    setSelectedReasons(checkedValues);
    if (!checkedValues.includes("Khác")) setOtherReason("");
  };

  const handleSubmit = async () => {
    let reason = selectedReasons.filter((r) => r !== "Khác").join(", ");
    if (selectedReasons.includes("Khác")) {
      reason = reason ? reason + ", " + otherReason : otherReason;
    }
    if (!reason.trim()) {
      notification.warning({
        message: "Vui lòng chọn hoặc nhập lý do báo cáo.",
      });
      return;
    }
    setLoading(true);
    try {
      await interactApi.createReport({ targetType, targetId, reason });
      notification.success({ message: "Gửi báo cáo thành công!" });
      setSelectedReasons([]);
      setOtherReason("");
      onCancel();
      if (onSuccess) onSuccess();
    } catch (_e) {
      // notification.error({ message: "Gửi báo cáo thất bại!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={<span className="font-semibold text-lg">Báo cáo vi phạm</span>}
      footer={null}
      centered
      className="rounded-lg"
    >
      <div className="mb-4">
        <Checkbox.Group
          options={reasons}
          value={selectedReasons}
          onChange={handleReasonChange}
          className="flex flex-col gap-2"
        />
        {selectedReasons.includes("Khác") && (
          <Input.TextArea
            className="mt-3"
            placeholder="Nhập lý do khác..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 4 }}
            maxLength={200}
            showCount
          />
        )}
      </div>
      <Button
        type="primary"
        block
        loading={loading}
        onClick={handleSubmit}
        className="bg-primary hover:bg-primary-dark font-semibold"
      >
        Gửi báo cáo
      </Button>
    </Modal>
  );
};

export default ReportModal;
