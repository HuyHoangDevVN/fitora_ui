import React, { useEffect, useState } from "react";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { userRepository } from "@/_base/const/Repository";
import { User } from "@/interfaces/User";
import { useNavigate } from "react-router-dom";

const SearchUser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await userRepository.get(
          `/user/get-users?UserName=${searchTerm}&Email=${searchTerm}&PageIndex=0&PageSize=5`
        );

        if (response?.isSuccess && response.data) {
          setResults(response.data.data || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handleUserClick = (user: User) => {
    const storedId = localStorage.getItem("x-client-id");
    if (user.id === storedId) {
      navigate("/profile");
    } else {
      navigate("/profile", { state: { isWatching: true, userId: user.id } });
    }
  };

  return (
    <div className="relative w-full max-w-[90%] sm:max-w-[300px] md:max-w-[450px] mx-auto">
      <Input
        size="middle"
        placeholder="Search Fitora..."
        className="rounded-3xl px-4 py-2 text-sm shadow-sm focus:ring focus:ring-primary focus:outline-none"
        suffix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Dropdown hiển thị kết quả tìm kiếm */}
      {searchTerm && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50">
          {loading ? (
            <div className="p-4 flex items-center gap-2">
              <Spin size="small" />
              <span>Đang tìm kiếm...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-gray-500">Không có kết quả</div>
          ) : (
            <>
              {/* Hiển thị số lượng kết quả */}
              <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                Có {results.length} kết quả
              </div>
              {results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  {/* Có thể hiển thị avatar nếu có dữ liệu */}
                  {/* <img src={user.profilePictureUrl} alt="avatar" className="w-8 h-8 rounded-full" /> */}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
