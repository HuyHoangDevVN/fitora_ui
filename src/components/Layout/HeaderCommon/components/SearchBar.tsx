import React, { useEffect, useState } from "react";
import { Avatar, Skeleton, Select } from "antd";
import { userRepository } from "@/api/repository";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { groupApi } from "@/api/groupApi";
import { postApi } from "@/api/postApi";
import SearchInput from "@/components/common/SearchInput";

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

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("post");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleResultClick = (result: any) => {
    if (searchType === "user") {
      navigate(`/profile/${result.id}`, {
        state: { isWatching: true },
      });
    } else if (searchType === "group") {
      navigate(`/group/${result.id}`);
    } else if (searchType === "post") {
      // Khi click vào kết quả bài viết, truyền content vào keySearch
      navigate(`/search/query=${encodeURIComponent(result.content || "")}`);
    }
  };

  const handleSearch = () => {
    // Khi ấn enter hoặc icon search, truyền text search vào keySearch
    if (searchType === "post") {
      navigate(`/search/query=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const debouncedFetch = debounce(async () => {
      setLoading(true);
      try {
        let response;
        if (searchType === "user") {
          response = await userRepository.get(
            `/user/get-users?KeySearch=${searchTerm}&PageIndex=0&PageSize=5`
          );
        } else if (searchType === "group") {
          response = await groupApi.getGroupList(searchTerm, 0, 5);
        } else if (searchType === "post") {
          response = await postApi.fetchPosts({
            feedType: 1,
            keySearch: searchTerm,
            limit: 5,
          });
        }
        setResults(response?.data?.data || []);
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
  }, [searchTerm, searchType]);

  return (
    <div className="relative w-full sm:w-[150px] md:w-[250px] lg:w-[300px] xl:w-[450px] 2xl:w-[600px] mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          placeholder={`Tìm kiếm ${
            searchType === "user"
              ? "người dùng"
              : searchType === "group"
              ? "nhóm"
              : "bài viết"
          }...`}
        />
      </div>

      {searchTerm && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50">
          <div className="p-2">
            <Select
              value={searchType}
              onChange={(value) => setSearchType(value)}
              className="w-full mb-2"
            >
              <Select.Option value="post">Tìm kiếm theo bài viết</Select.Option>
              <Select.Option value="user">
                Tìm kiếm theo người dùng
              </Select.Option>
              <Select.Option value="group">Tìm kiếm theo nhóm</Select.Option>
            </Select>
          </div>
          {loading ? (
            <div className="p-2">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <SkeletonItem key={index} />
                ))}
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-gray-500">Không tìm thấy kết quả</div>
          ) : (
            <>
              {searchType === "user" && (
                <>
                  <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                    {results.length} người dùng được tìm thấy
                  </div>
                  {results.map((result) => (
                    <UserResult
                      key={result.id}
                      user={result}
                      onClick={handleResultClick}
                    />
                  ))}
                </>
              )}
              {searchType === "group" && (
                <>
                  <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                    {results.length} nhóm được tìm thấy
                  </div>
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="flex flex-col gap-1 p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="font-medium text-gray-800 line-clamp-1">
                        {result.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {result.description}
                      </div>
                    </div>
                  ))}
                </>
              )}
              {searchType === "post" && results.length > 0 && (
                <>
                  <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                    {results.length} bài viết được tìm thấy
                  </div>
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="flex flex-col gap-1 p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="font-medium text-gray-800 line-clamp-1">
                        {result.title || result.content}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {result.content}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
