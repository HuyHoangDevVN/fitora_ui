import { adminApi } from "@/api/adminApi";
import { Post } from "@/types/post";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Table, Tooltip } from "antd";
import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import PostDeleteModal from "./PostDeleteModal";
import PostViewModal from "./PostViewModal";

const PostManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    title?: string;
  }>({
    open: false,
    id: null,
    title: undefined,
  });
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    const debouncedFetch = debounce(async () => {
      setLoading(true);
      try {
        const res = await adminApi.getPosts({
          pageIndex: pagination.current,
          pageSize: pagination.pageSize,
          // Không truyền keySearch vì API không hỗ trợ
        });
        setPosts(res.data?.data ?? []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.count ?? res.data?.data?.length ?? 0,
        }));
      } catch {
        setPosts([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    }, 400);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [pagination.current, pagination.pageSize]);

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
      .getPosts({
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        // Không truyền keySearch vì API không hỗ trợ
      })
      .then((res) => {
        setPosts(res.data?.data ?? []);
        setPagination((prev) => ({
          ...prev,
          total: res.data?.count ?? res.data?.data?.length ?? 0,
        }));
      })
      .catch(() => {
        setPosts([]);
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
      title: "Tiêu đề",
      dataIndex: "content",
      key: "content",
      width: 250,
      ellipsis: true,
      render: (text: string) => (
        <span className="font-medium text-blue-700">
          {text?.slice(0, 40) + (text?.length > 40 ? "..." : "")}
        </span>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: ["user", "username"],
      key: "authorName",
      width: 180,
      ellipsis: true,
      render: (_: any, record: Post) =>
        record.user?.username || (
          <span className="text-gray-400">(Không có)</span>
        ),
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
      render: (_text, record: Post) => (
        <Flex justify="center" gap={10}>
          <Tooltip title="Xem chi tiết" color="blue">
            <Button
              icon={<FaEye />}
              onClick={() => setViewModal({ open: true, id: record.id })}
            ></Button>
          </Tooltip>
          <Tooltip title="Xóa" color="red">
            <Button
              icon={<AiOutlineDelete />}
              onClick={() =>
                setDeleteModal({
                  open: true,
                  id: record.id,
                  title: record.content?.slice(0, 40),
                })
              }
            ></Button>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const pagedData = posts;

  return (
    <div className="px-6 bg-white rounded shadow max-w mx-auto animate-fade-in dark:bg-gray-900 dark:shadow-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2 dark:text-blue-300">
          <span>Quản lý bài viết</span>
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
          placeholder="Tìm kiếm bài viết..."
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
      <PostViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, id: null })}
        postId={viewModal.id}
      />
      <PostDeleteModal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, id: null, title: undefined })
        }
        postId={deleteModal.id ?? undefined}
        postTitle={deleteModal.title}
        onSuccess={() => {
          setDeleteModal({ open: false, id: null, title: undefined });
          handleSearch();
        }}
      />
    </div>
  );
};

export default PostManagement;
