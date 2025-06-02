import {
  Table,
  Input,
  Button,
  Tag,
  Switch,
  notification,
  Tooltip,
  Flex,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRef, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { adminApi } from "@/api/adminApi";
import type { Account } from "@/types/account";
import { FaEye, FaRegEdit } from "react-icons/fa";
import RoleViewModal from "./RoleViewModal";
import RoleEditModal from "./RoleEditModal";
import AccountDeleteModal from "./RoleDeleteModal";
import { AiOutlineUserDelete } from "react-icons/ai";

const RoleManagement = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
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
  const [editModal, setEditModal] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    email?: string;
  }>({
    open: false,
    id: null,
    email: undefined,
  });
  const searchInputRef = useRef<any>(null);

  // Debounced search effect (clean code)
  useEffect(() => {
    const debouncedFetch = debounce(async () => {
      setLoading(true);
      try {
        const res = await adminApi.getAccounts({
          pageIndex: 0,
          pageSize: pagination.pageSize,
          keySearch: search,
        });
        setAccounts(res.data?.data ?? []);
        setPagination({
          current: res.data.pageIndex,
          pageSize: res.data.pageSize,
          total: res.data.count ?? 0,
        });
      } catch (error) {
        console.error("Lỗi tìm kiếm tài khoản:", error);
        setAccounts([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    }, 400);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [search, pagination.pageSize]);

  // Table pagination change handler
  const handleTableChange = (pag) => {
    setLoading(true);
    adminApi
      .getAccounts({
        pageIndex: (pag.current ?? 1) - 1,
        pageSize: pag.pageSize,
        keySearch: search,
      })
      .then((res) => {
        setAccounts(res.data?.data ?? []);
        setPagination({
          current: res.data.pageIndex,
          pageSize: res.data.pageSize,
          total: res.data.count ?? 0,
        });
      })
      .catch((error) => {
        setAccounts([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        console.error("Lỗi phân trang tài khoản:", error);
      })
      .finally(() => setLoading(false));
  };

  // Manual search button handler
  const handleSearch = () => {
    setLoading(true);
    adminApi
      .getAccounts({
        pageIndex: 0,
        pageSize: pagination.pageSize,
        keySearch: search,
      })
      .then((res) => {
        setAccounts(res.data?.data ?? []);
        setPagination({
          current: res.data.pageIndex,
          pageSize: res.data.pageSize,
          total: res.data.count ?? 0,
        });
      })
      .catch((error) => {
        setAccounts([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        console.error("Lỗi tìm kiếm thủ công:", error);
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
      title: "Tên tài khoản",
      dataIndex: "email",
      key: "email",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <span className="font-medium text-blue-700">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      width: 180,
      render: (roles: string[]) =>
        roles && roles.length > 0 ? (
          roles.map((role) => (
            <Tag
              key={role}
              color={role === "ADMIN" ? "blue" : "default"}
              className="font-semibold text-xs"
            >
              {role}
            </Tag>
          ))
        ) : (
          <Tag className="dark:bg-brand-500 dark:text-gray-200">Không có</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: number) => {
        switch (status) {
          case 1:
            return <Tag color="green">Hoạt động</Tag>;
          case 2:
            return <Tag color="red">Bị chặn</Tag>;
          case 3:
            return <Tag color="orange">Bị khoá</Tag>;
          case 4:
            return <Tag color="default">Đã xoá</Tag>;
          default:
            return <Tag color="default">Không rõ</Tag>;
        }
      },
    },
    {
      title: "Khóa tài khoản",
      width: 120,
      render: (_text, record) => {
        const isLocked = record.status === 3;
        return (
          <Switch
            checkedChildren="Mở khóa"
            unCheckedChildren="Khóa"
            checked={isLocked}
            loading={loading}
            onClick={async () => {
              try {
                const res = isLocked
                  ? await adminApi.unlockAccount(record.id)
                  : await adminApi.lockAccount(record.id);
                notification[res?.isSuccess ? "success" : "error"]({
                  message: isLocked
                    ? res?.isSuccess
                      ? "Mở khóa tài khoản thành công"
                      : "Mở khóa tài khoản thất bại"
                    : res?.isSuccess
                    ? "Khóa tài khoản thành công"
                    : "Khóa tài khoản thất bại",
                });
                handleSearch();
              } catch {
                notification.error({
                  message: "Có lỗi xảy ra khi thao tác tài khoản",
                });
              }
            }}
            className={
              isLocked
                ? "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                : "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
            }
          />
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_text, record) => (
        <Flex justify="center" gap={10}>
          <Tooltip title="Xem chi tiết" color="blue">
            <Button
              icon={<FaEye />}
              onClick={() => setViewModal({ open: true, id: record.id })}
              className="text-blue-600 hover:text-blue-800 dark:text-brand-500 dark:hover:text-brand-400"
            ></Button>
          </Tooltip>
          <Tooltip title="Sửa" color="orange">
            <Button
              icon={<FaRegEdit />}
              onClick={() => setEditModal({ open: true, id: record.id })}
              className="text-orange-500 hover:text-orange-800 dark:text-brand-500 dark:hover:text-brand-400"
            ></Button>
          </Tooltip>
          <Tooltip title="Xóa" color="red">
            <Button
              icon={<AiOutlineUserDelete />}
              onClick={() =>
                setDeleteModal({
                  open: true,
                  id: record.id,
                  email: record.email,
                })
              }
              className="text-red-500 hover:text-red-800 dark:text-brand-500 dark:hover:text-brand-400"
            ></Button>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <div className="px-6 bg-white rounded shadow max-w mx-auto animate-fade-in dark:bg-gray-900 dark:shadow-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2 dark:text-blue-300">
        <span>Quản lý tài khoản</span>
        <Button
          icon={<ReloadOutlined className="dark:text-brand-500" />}
          onClick={handleSearch}
          size="small"
          className="ml-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-brand-500 dark:bg-brand-50 dark:text-brand-500 dark:hover:bg-gray-800"
        />
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <Input
          allowClear
          ref={searchInputRef}
          placeholder="Tìm kiếm tài khoản..."
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
        dataSource={accounts}
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
      <RoleViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, id: null })}
        accountId={viewModal.id}
      />
      <RoleEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, id: null })}
        accountId={editModal.id}
        onSuccess={() => {
          setEditModal({ open: false, id: null });
          handleSearch();
        }}
      />
      <AccountDeleteModal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, id: null, email: undefined })
        }
        accountId={deleteModal.id}
        email={deleteModal.email}
        onSuccess={() => {
          setDeleteModal({ open: false, id: null, email: undefined });
          handleSearch();
        }}
      />
    </div>
  );
};

export default RoleManagement;
