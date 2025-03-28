import React, { useEffect, useState, useRef } from "react";
import { Avatar, Input, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { userRepository } from "@/api/repository";
import { User } from "@/types/User";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

const SkeletonItem: React.FC = () => (
  <div className="flex items-center gap-2 p-2">
    <Skeleton.Avatar active size={40} shape="circle" />
    <div className="flex flex-col flex-1">
      <Skeleton.Input active style={{ width: 120, height: 14 }} />
      <Skeleton.Input active style={{ width: 80, height: 12 }} />
    </div>
  </div>
);

const UserResult = React.memo(
  ({ user, onClick }: { user: User; onClick: (user: User) => void }) => (
    <div
      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onClick(user)}
    >
      <Avatar
        src={user?.profilePictureUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full shadow-sm"
      />
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-500">{user.username}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  )
);

const SearchUser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const searchRef = useRef("");

  const handleUserClick = (user: User) => {
    const storedId = localStorage.getItem("x-client-id");
    navigate(user.id === storedId ? "/personal" : "/personal", {
      state: { isWatching: true, userId: user.id },
    });
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const debouncedFetch = debounce(async () => {
      setLoading(true);
      try {
        const response = await userRepository.get(
          `/user/get-users?KeySearch=${searchTerm}&PageIndex=0&PageSize=5`
        );
        setResults(response?.isSuccess ? response.data.data || [] : []);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm]);

  return (
    <div className="relative w-full sm:w-[150px] md:w-[250px] lg:w-[300px] xl:w-[450px] 2xl:w-[600px] mx-auto">
      <Input
        size="middle"
        placeholder="Search Fitora..."
        className="rounded-3xl px-4 py-2 text-sm shadow-sm focus:ring focus:ring-primary focus:outline-none"
        suffix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => {
          searchRef.current = e.target.value;
          setSearchTerm(e.target.value);
        }}
      />

      {searchTerm && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50">
          {loading ? (
            <div className="p-2">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <SkeletonItem key={index} />
                ))}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-gray-500">Không có kết quả</div>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                Có {results.length} kết quả
              </div>
              {results.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  onClick={handleUserClick}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
