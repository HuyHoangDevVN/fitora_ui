import { Modal, Button } from "antd";

interface ReportDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
}

const ReportDeleteModal = ({
  open,
  onClose,
  onDelete,
  loading,
}: ReportDeleteModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
      title={
        <span className="text-lg font-bold text-red-600 dark:text-red-400">
          Xác nhận xóa báo cáo
        </span>
      }
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="text-center text-base text-gray-700 dark:text-gray-200">
          Bạn có chắc chắn muốn xóa báo cáo này?
          <br />
          Hành động này không thể hoàn tác.
        </div>
        <div className="flex justify-end gap-2 w-full mt-4">
          <Button
            onClick={onClose}
            className="dark:bg-gray-700 dark:text-gray-200 border-none px-6"
            disabled={loading}
          >
            Huỷ
          </Button>
          <Button
            danger
            type="primary"
            onClick={onDelete}
            loading={loading}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 px-6 font-semibold"
          >
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportDeleteModal;
