import { Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/adminApi";
import { Role } from "@/types/role";

interface RoleSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

const RoleSelect = ({ value, onChange, disabled }: RoleSelectProps) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminApi
      .getRoles({ pageIndex: 0, pageSize: 100 })
      .then((res) => setRoles(res?.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Select
      mode="multiple"
      allowClear
      showSearch
      placeholder="Chọn vai trò"
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      loading={loading}
      className="dark:bg-gray-800 dark:text-white"
      options={roles.map((role) => ({
        label: role.roleName,
        value: role.roleName,
      }))}
      notFoundContent={loading ? <Spin size="small" /> : null}
      style={{ width: "100%" }}
    />
  );
};

export default RoleSelect;
