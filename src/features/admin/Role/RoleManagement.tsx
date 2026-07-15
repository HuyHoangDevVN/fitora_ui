import { adminApi } from "@/api/adminApi";
import { Role } from "@/types/role";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Table, Tooltip } from "antd";
import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import { AiOutlineUserDelete } from "react-icons/ai";
import { FaEye, FaRegEdit } from "react-icons/fa";
import AccountDeleteModal from "./RoleDeleteModal";
import RoleCreateModal from "./RoleCreateModal";
import RoleEditModal from "./RoleEditModal";
import RoleViewModal from "./RoleViewModal";

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
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
    roleName: string;
  }>({
    open: false,
    roleName: "",
  });
  const [createModal, setCreateModal] = useState({ open: false });
  const searchInputRef = useRef<any>(null);

  useEffect(() => {
    const debouncedFetch = debounce(async () => {
      setLoading(true);
      try {
        const res = await adminApi.getRoles({
          pageIndex: 0,
          pageSize: pagination.pageSize,
          keySearch: search,
        });
        setRoles(res?.data?.data ?? []);
        setPagination({
          current: res.data?.pageIndex ?? 0,
          pageSize: res.data?.pageSize ?? pagination.pageSize,
          total: res.data?.count ?? 0,
        });
      } catch (error) {
        console.error("Lỗi tìm kiếm tài khoản:", error);
        setRoles([]);
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
      .getRoles({
        pageIndex: (pag.current ?? 1) - 1,
        pageSize: pag.pageSize,
        keySearch: search,
      })
      .then((res) => {
        setRoles(res?.data?.data ?? []);
        setPagination({
          current: res.data?.pageIndex ?? 0,
          pageSize: res.data?.pageSize ?? pagination.pageSize,
          total: res.data?.count ?? 0,
        });
      })
      .catch((error) => {
        setRoles([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        console.error("Lỗi phân trang role:", error);
      })
      .finally(() => setLoading(false));
  };

  // Manual search button handler
  const handleSearch = () => {
    setLoading(true);
    adminApi
      .getRoles({
        pageIndex: 0,
        pageSize: pagination.pageSize,
        keySearch: search,
      })
      .then((res) => {
        setRoles(res?.data?.data ?? []);
        setPagination({
          current: res.data?.pageIndex ?? 0,
          pageSize: res.data?.pageSize ?? pagination.pageSize,
          total: res.data?.count ?? 0,
        });
      })
      .catch((error) => {
        setRoles([]);
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
      title: "Tên role",
      dataIndex: "roleName",
      key: "roleName",
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <span className="font-medium text-blue-700">{text}</span>
      ),
    },
    {
      title: "Số người dùng",
      dataIndex: "totalUser",
      key: "totalUser",
      width: 200,
      ellipsis: true,
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
              onClick={() => setViewModal({ open: true, id: record.roleId })}
              className="text-blue-600 hover:text-blue-800 dark:text-brand-500 dark:hover:text-brand-400"
            ></Button>
          </Tooltip>
          <Tooltip title="Sửa" color="orange">
            <Button
              icon={<FaRegEdit />}
              onClick={() => setEditModal({ open: true, id: record.roleId })}
              className="text-orange-500 hover:text-orange-800 dark:text-brand-500 dark:hover:text-brand-400"
            ></Button>
          </Tooltip>
          <Tooltip title="Xóa" color="red">
            <Button
              icon={<AiOutlineUserDelete />}
              onClick={() =>
                setDeleteModal({
                  open: true,
                  roleName: record.roleName,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2 dark:text-blue-300">
          <span>Quản lý role</span>
          <Button
            icon={<ReloadOutlined className="dark:text-brand-500" />}
            onClick={handleSearch}
            size="small"
            className="ml-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-brand-500 dark:bg-brand-50 dark:text-brand-500 dark:hover:bg-gray-800"
          />
        </h1>
        <Button
          type="primary"
          className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 font-semibold flex items-center gap-2"
          onClick={() => setCreateModal({ open: true })}
        >
          <span className="text-lg">+</span> Tạo vai trò
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <Input
          allowClear
          ref={searchInputRef}
          placeholder="Tìm kiếm vai trò..."
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
        dataSource={roles}
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
      <RoleCreateModal
        open={createModal.open}
        onClose={() => setCreateModal({ open: false })}
        onSuccess={() => {
          setCreateModal({ open: false });
          handleSearch();
        }}
      />
      <RoleViewModal
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, id: null })}
        roleId={viewModal.id}
      />
      <RoleEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, id: null })}
        roleId={editModal.id}
        onSuccess={() => {
          setEditModal({ open: false, id: null });
          handleSearch();
        }}
      />
      <AccountDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, roleName: "" })}
        roleName={deleteModal.roleName}
        onSuccess={() => {
          setDeleteModal({ open: false, roleName: "" });
          handleSearch();
        }}
      />
    </div>
  );
};

export default RoleManagement;
