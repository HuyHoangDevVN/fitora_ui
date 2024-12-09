import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

const App: React.FC = () => (
  <div className="flex w-full">
    <Input
      size="middle"
      placeholder="Search Fitora..."
      className="flex rounded-3xl px-4 py-2 text-sm shadow-sm focus:ring focus:ring-primary focus:outline-none"
      suffix={<SearchOutlined />}
    />
  </div>
);

export default App;
