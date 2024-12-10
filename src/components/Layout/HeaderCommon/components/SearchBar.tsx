import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

const App: React.FC = () => (
  <div className="w-full max-w-[90%] sm:max-w-[300px] md:max-w-[450px] mx-auto">
    <Input
      size="middle"
      placeholder="Search Fitora..."
      className="flex rounded-3xl px-4 py-2 text-sm shadow-sm focus:ring focus:ring-primary focus:outline-none"
      suffix={<SearchOutlined />}
    />
  </div>
);

export default App;
