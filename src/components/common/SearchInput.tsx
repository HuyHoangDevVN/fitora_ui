// Tạo component SearchInput dùng chung
import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm...",
  className = "",
}) => (
  <Input
    size="middle"
    placeholder={placeholder}
    className={`rounded-3xl px-4 py-2 text-sm shadow-sm focus:ring focus:ring-primary focus:outline-none ${className}`}
    suffix={<SearchOutlined onClick={onSearch} style={{ cursor: "pointer" }} />}
    value={value}
    onChange={onChange}
    onPressEnter={onSearch}
  />
);

export default SearchInput;
