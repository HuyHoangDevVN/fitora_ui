import { adminApi } from "@/api/adminApi";
import { Comment } from "@/types/comment";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Table, Tooltip, Modal } from "antd";
import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

const CommentManagement = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    content?: string;
  }>({
    open: false,
    id: null,
    content: undefined,
  });
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    const debouncedFetch = debounce(async () => {
      setLoading(true);
      try {
        const res = await adminApi.getComments({
          postId: search, // giả sử search là postId, có thể sửa lại UI để nhập postId hoặc lọc theo post
          pageIndex: pagination.current,
          pageSize: pagination.pageSize,
        });
        setComments(res.data?.data ?? []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.count ?? res.data?.data?.length ?? 0,
        }));
      } catch {
        setComments([]);
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
      .getComments({
        postId: search,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((res) => {
        setComments(res.data?.data ?? []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.count ?? res.data?.data?.length ?? 0,
        }));
      })
      .catch(() => {
        setComments([]);
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
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <span className="font-medium text-blue-700">
          {text?.slice(0, 60) + (text?.length > 60 ? "..." : "")}
        </span>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "userId",
      key: "userId",
      width: 180,
      ellipsis: true,
      render: (userId: string) =>
        userId || <span className="text-gray-400">(Không có)</span>,
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) =>
        date ? new Date(date).toLocaleString("vi-VN") : "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
      align: "center" as const,
      render: (isDeleted: boolean) => (
        <span className={!isDeleted ? "text-green-600" : "text-red-500"}>
          {!isDeleted ? "Hoạt động" : "Đã xóa"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_text, record: Comment) => (
        <Flex justify="center" gap={10}>
          <Tooltip title="Xóa" color="red">
            <Button
              icon={<AiOutlineDelete />}
              onClick={() =>
                setDeleteModal({
                  open: true,
                  id: record.postId,
                  content: record.content?.slice(0, 60),
                })
              }
            ></Button>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const pagedData = comments;

  return (
    <div className="px-6 bg-white rounded shadow max-w mx-auto animate-fade-in dark:bg-gray-900 dark:shadow-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2 dark:text-blue-300">
          <span>Quản lý bình luận</span>
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
          placeholder="Tìm kiếm theo postId..."
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
      {/* Modal xác nhận xóa comment */}
      {deleteModal.open && (
        <Modal
          open={deleteModal.open}
          onCancel={() =>
            setDeleteModal({ open: false, id: null, content: undefined })
          }
          footer={null}
          centered
          className="[&_.ant-modal-content]:bg-white dark:[&_.ant-modal-content]:bg-gray-900 [&_.ant-modal-content]:text-gray-900 dark:[&_.ant-modal-content]:text-gray-100"
          title={
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              Xác nhận xóa bình luận
            </span>
          }
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-center text-base text-gray-700 dark:text-gray-200">
              Bạn có chắc chắn muốn xóa bình luận
              <span className="font-semibold text-red-600 dark:text-red-400">
                {deleteModal.content ? ` "${deleteModal.content}" ` : " này "}
              </span>
              ?<br />
              Hành động này không thể hoàn tác.
            </div>
            <div className="flex justify-end gap-2 w-full mt-4">
              <Button
                onClick={() =>
                  setDeleteModal({ open: false, id: null, content: undefined })
                }
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
                    const res = await adminApi.deleteComment(deleteModal.id);
                    if (res?.isSuccess) {
                      setDeleteModal({
                        open: false,
                        id: null,
                        content: undefined,
                      });
                      handleSearch();
                    } else {
                      Modal.error({
                        title: "Xóa bình luận thất bại",
                        content:
                          res?.message ||
                          "Không thể xóa bình luận. Vui lòng thử lại!",
                      });
                    }
                  } catch {
                    Modal.error({
                      title: "Lỗi hệ thống",
                      content: "Không thể xóa bình luận. Vui lòng thử lại!",
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

export default CommentManagement;
