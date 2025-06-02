import { adminApi } from "@/api/adminApi";
import { Report } from "@/types/report";
import { ReportStatus } from "@/enums/reportStatus";
import { TargetType } from "@/enums/targetType";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Modal, Select, Table, Tooltip } from "antd";
import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

const ReportManagement = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    report: Report | null;
  }>({
    open: false,
    report: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    const debouncedFetch = debounce(async () => {
      setLoading(true);
      try {
        const res = await adminApi.getReports({
          pageIndex: pagination.current,
          pageSize: pagination.pageSize,
          keySearch: search,
        });
        setReports(res.data?.data ?? []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.count ?? res.data?.data?.length ?? 0,
        }));
      } catch {
        setReports([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    }, 400);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [search, pagination.current, pagination.pageSize]);

  const handleTableChange = (pag) => {
    setPagination((prev) => ({
      ...prev,
      current: pag.current - 1,
      pageSize: pag.pageSize,
    }));
  };

  const handleSearch = () => {
    setLoading(true);
    adminApi
      .getReports({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        keySearch: search,
      })
      .then((res) => {
        setReports(res.data?.data ?? []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.count ?? res.data?.data?.length ?? 0,
        }));
      })
      .catch(() => {
        setReports([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      })
      .finally(() => setLoading(false));
    searchInputRef.current?.blur();
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_text, _record, index) =>
        pagination.current * pagination.pageSize + index + 1,
    },
    {
      title: "Người báo cáo",
      dataIndex: "userId",
      key: "userId",
      width: 180,
      ellipsis: true,
      render: (userId: string) =>
        userId || <span className="text-gray-400">(Không có)</span>,
    },
    {
      title: "Loại đối tượng",
      dataIndex: "targetType",
      key: "targetType",
      width: 120,
      render: (type: TargetType) =>
        type === TargetType.Comment
          ? "Bình luận"
          : type === TargetType.Post
          ? "Bài viết"
          : "Khác",
    },
    {
      title: "ID đối tượng",
      dataIndex: "targetId",
      key: "targetId",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: ReportStatus) => {
        switch (status) {
          case ReportStatus.Pending:
            return <span className="text-yellow-600">Chờ xử lý</span>;
          case ReportStatus.InProgress:
            return <span className="text-blue-600">Đang xử lý</span>;
          case ReportStatus.Resolved:
            return <span className="text-green-600">Đã giải quyết</span>;
          case ReportStatus.Closed:
            return <span className="text-gray-600">Đã đóng</span>;
          case ReportStatus.Rejected:
            return <span className="text-red-600">Từ chối</span>;
          case ReportStatus.Archived:
            return <span className="text-gray-400">Đã lưu trữ</span>;
          default:
            return "-";
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      render: (_text, record: Report) => (
        <Flex justify="center" gap={10}>
          <Tooltip title="Xem chi tiết" color="blue">
            <Button
              onClick={() => setViewModal({ open: true, report: record })}
              className="text-blue-600"
            >
              Xem
            </Button>
          </Tooltip>
          <Tooltip title="Xóa" color="red">
            <Button
              icon={<AiOutlineDelete />}
              onClick={() =>
                setDeleteModal({ open: true, id: record.targetId })
              }
            ></Button>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const pagedData = reports;

  return (
    <div className="px-6 bg-white rounded shadow max-w mx-auto animate-fade-in dark:bg-gray-900 dark:shadow-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2 dark:text-blue-300">
          <span>Quản lý báo cáo</span>
          <Button
            icon={<ReloadOutlined className="dark:text-brand-500" />}
            onClick={handleSearch}
            size="small"
            className="ml-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-brand-500 dark:bg-brand-50 dark:text-brand-500 dark:hover:bg-gray-800"
          />
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <Input
          allowClear
          ref={searchInputRef}
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          styles={{ input: { borderRadius: "0.375rem" } }}
          className="w-full sm:w-72 border-blue-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-blue-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 [&_.ant-input::placeholder]:text-gray-400 dark:[&_.ant-input::placeholder]:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button
          type="primary"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={pagedData}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        bordered
        className="bg-white rounded shadow dark:bg-gray-900 dark:shadow-gray-800 dark:border-gray-700 dark:text-gray-100 [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:text-gray-700 dark:[&_.ant-table-thead>tr>th]:bg-gray-800 dark:[&_.ant-table-thead>tr>th]:text-gray-200 [&_.ant-table-tbody>tr>td]:bg-white dark:[&_.ant-table-tbody>tr>td]:bg-gray-900 [&_.ant-table-tbody>tr>td]:text-gray-900 dark:[&_.ant-table-tbody>tr>td]:text-gray-100 [&_.ant-table-pagination]:bg-transparent"
        scroll={{ x: 900 }}
        size="middle"
      />
      {/* Modal xem chi tiết report */}
      {viewModal.open && viewModal.report && (
        <Modal
          open={viewModal.open}
          onCancel={() => setViewModal({ open: false, report: null })}
          footer={null}
          centered
          className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
          title={
            <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
              Chi tiết báo cáo
            </span>
          }
        >
          <div className="flex flex-col gap-4">
            <div>
              <b>Người báo cáo:</b> {viewModal.report.userId}
            </div>
            <div>
              <b>Loại đối tượng:</b>{" "}
              {viewModal.report.targetType === TargetType.Comment
                ? "Bình luận"
                : viewModal.report.targetType === TargetType.Post
                ? "Bài viết"
                : "Khác"}
            </div>
            <div>
              <b>ID đối tượng:</b> {viewModal.report.targetId}
            </div>
            <div>
              <b>Lý do:</b> {viewModal.report.reason}
            </div>
            <div>
              <b>Trạng thái:</b>{" "}
              {(() => {
                switch (viewModal.report?.status) {
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
                value={viewModal.report?.status}
                style={{ minWidth: 120 }}
                onChange={async (value) => {
                  if (!viewModal.report) return;
                  try {
                    await adminApi.updateReport({
                      reportId: viewModal.report.targetId,
                      status: value,
                    });
                    setViewModal({ open: false, report: null });
                    handleSearch();
                  } catch {
                    Modal.error({
                      title: "Cập nhật trạng thái thất bại",
                      content: "Không thể cập nhật trạng thái báo cáo.",
                    });
                  }
                }}
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
        </Modal>
      )}
      {/* Modal xác nhận xóa report */}
      {deleteModal.open && (
        <Modal
          open={deleteModal.open}
          onCancel={() => setDeleteModal({ open: false, id: null })}
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
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="dark:bg-gray-700 dark:text-gray-200 border-none px-6"
              >
                Huỷ
              </Button>
              <Button
                danger
                type="primary"
                onClick={async () => {
                  if (!deleteModal.id) return;
                  setLoading(true);
                  try {
                    const res = await adminApi.deleteReport(deleteModal.id);
                    if (res?.isSuccess) {
                      setDeleteModal({ open: false, id: null });
                      handleSearch();
                    } else {
                      Modal.error({
                        title: "Xóa báo cáo thất bại",
                        content:
                          res?.message ||
                          "Không thể xóa báo cáo. Vui lòng thử lại!",
                      });
                    }
                  } catch {
                    Modal.error({
                      title: "Lỗi hệ thống",
                      content: "Không thể xóa báo cáo. Vui lòng thử lại!",
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 px-6 font-semibold"
              >
                Xóa
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReportManagement;
