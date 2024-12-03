import { SearchOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import React from "react";
const App: React.FC = () => (
  <Space direction="vertical">
    <Input
      size="middle"
      placeholder="Search fitora..."
      variant="outlined"
      style={{ width: 450, borderRadius: "15px", padding: "6px 10px" }}
      suffix={<SearchOutlined />}
    />
  </Space>
);

export default App;
