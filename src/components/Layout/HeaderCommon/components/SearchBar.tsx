import React, { useCallback, useMemo, useRef, useState, memo } from "react";
import { Avatar, Skeleton, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { userApi } from "@/api/userApi";
import { groupApi } from "@/api/groupApi";
import { postApi } from "@/api/postApi";
import { User } from "@/types/user";
import SearchInput from "@/components/common/SearchInput";

// Types
type SearchType = "post" | "user" | "group";

interface SearchResult {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  content?: string;
  title?: string;
  description?: string;
  profilePictureUrl?: string;
}

interface SearchConfig {
  placeholder: string;
  resultLabel: string;
}

// Constants
const SEARCH_CONFIGS: Record<SearchType, SearchConfig> = {
  post: { placeholder: "bài viết", resultLabel: "bài viết" },
  user: { placeholder: "người dùng", resultLabel: "người dùng" },
  group: { placeholder: "nhóm", resultLabel: "nhóm" },
} as const;

const SEARCH_TABS = [
  { key: "post" as const, label: "Bài viết" },
  { key: "user" as const, label: "Người dùng" },
  { key: "group" as const, label: "Nhóm" },
] as const;

const DEBOUNCE_DELAY = 400;
const BLUR_DELAY = 200;
const MAX_RESULTS = 5;

// Memoized Components
const LoadingSkeleton = memo(() => (
  <div className="p-2">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex items-center gap-2 p-2">
        <Skeleton.Avatar active size={40} shape="circle" />
        <div className="flex flex-col flex-1">
          <Skeleton.Input active style={{ width: 120, height: 14 }} />
          <Skeleton.Input active style={{ width: 80, height: 12 }} />
        </div>
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

const UserResultItem = memo(
  ({ user, onClick }: { user: User; onClick: (user: User) => void }) => (
    <div
      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={() => onClick(user)}
    >
      <Avatar
        src={user?.profilePictureUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full shadow-sm"
      />
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-800">{user.username}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  )
);

UserResultItem.displayName = "UserResultItem";

const GenericResultItem = memo(
  ({
    item,
    onClick,
    title,
    subtitle,
  }: {
    item: SearchResult;
    onClick: (item: SearchResult) => void;
    title: string;
    subtitle: string;
  }) => (
    <div
      className="flex flex-col gap-1 p-2 hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={() => onClick(item)}
    >
      <div className="font-medium text-gray-800 line-clamp-1">{title}</div>
      <div className="text-xs text-gray-500 line-clamp-2">{subtitle}</div>
    </div>
  )
);

GenericResultItem.displayName = "GenericResultItem";

const SearchTypeTab = memo(
  ({
    isActive,
    label,
    onClick,
  }: {
    isActive: boolean;
    label: string;
    onClick: () => void;
  }) => (
    <button
      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-primary border-b-2 border-primary bg-blue-50"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
      }`}
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
    >
      {label}
    </button>
  )
);

SearchTypeTab.displayName = "SearchTypeTab";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<SearchType>("post");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTypeChangeRef = useRef(false); // Memoized search function
  const searchAPI = useMemo(
    () => ({
      user: async (term: string): Promise<SearchResult[]> => {
        const response = await userApi.getUsers(term, 0, MAX_RESULTS);
        return response.data?.data || [];
      },
      group: async (term: string): Promise<SearchResult[]> => {
        const response = await groupApi.getGroupList(term, 0, MAX_RESULTS);
        return (response as any) || [];
      },
      post: async (term: string): Promise<SearchResult[]> => {
        const response = await postApi.fetchPosts({
          feedType: 1,
          keySearch: term,
          limit: MAX_RESULTS,
        });
        return response.data?.data || [];
      },
    }),
    []
  );

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string, type: SearchType) => {
        if (!term.trim()) {
          setResults([]);
          return;
        }

        setLoading(true);
        try {
          const data = await searchAPI[type](term);
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, DEBOUNCE_DELAY),
    [searchAPI]
  );

  // Handlers
  const handleResultClick = useCallback(
    (result: SearchResult) => {
      setDropdownOpen(false);

      const navigationMap = {
        user: () =>
          navigate(`/profile/${result.id}`, { state: { isWatching: true } }),
        group: () => navigate(`/group/${result.id}`),
        post: () =>
          navigate(`/search/${encodeURIComponent(result.content || "")}`),
      };

      navigationMap[searchType]?.();
    },
    [searchType, navigate]
  );

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
      setDropdownOpen(false);
    }
  }, [searchTerm, navigate]);

  const handleSearchTypeChange = useCallback(
    (type: SearchType) => {
      searchTypeChangeRef.current = true;
      setSearchType(type);

      if (searchTerm.trim()) {
        debouncedSearch(searchTerm, type);
        setDropdownOpen(true);
      }

      setTimeout(() => {
        searchTypeChangeRef.current = false;
      }, 100);
    },
    [searchTerm, debouncedSearch]
  );

  const handleInputFocus = useCallback(() => {
    if (searchTerm.trim()) {
      setDropdownOpen(true);
    }
  }, [searchTerm]);

  const handleInputBlur = useCallback(() => {
    if (searchTypeChangeRef.current) {
      return;
    }

    setTimeout(() => {
      const activeElement = document.activeElement;
      const dropdownElement = dropdownRef.current;

      if (dropdownElement && dropdownElement.contains(activeElement)) {
        return;
      }

      if (!searchTypeChangeRef.current) {
        setDropdownOpen(false);
      }
    }, BLUR_DELAY);
  }, []);

  const handleDropdownMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleSearchTermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (value.trim()) {
        setDropdownOpen(true);
        debouncedSearch(value, searchType);
      } else {
        setDropdownOpen(false);
        setResults([]);
      }
    },
    [searchType, debouncedSearch]
  );

  // Cleanup
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Memoized values
  const placeholder = useMemo(
    () => `Tìm kiếm ${SEARCH_CONFIGS[searchType].placeholder}...`,
    [searchType]
  );

  const hasResults = results.length > 0;
  const showEmptyState = !loading && !hasResults && searchTerm.trim();

  return (
    <div className="relative w-full sm:w-[150px] md:w-[250px] lg:w-[300px] xl:w-[450px] 2xl:w-[600px] mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <div
          ref={inputWrapperRef}
          style={{ width: "100%" }}
          tabIndex={-1}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        >
          <SearchInput
            value={searchTerm}
            onChange={handleSearchTermChange}
            onSearch={handleSearch}
            placeholder={placeholder}
          />
        </div>
      </div>

      {dropdownOpen && searchTerm && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          onMouseDown={handleDropdownMouseDown}
        >
          {/* Search Type Tabs */}
          <div className="flex border-b sticky top-0 bg-white z-10">
            {SEARCH_TABS.map((tab) => (
              <SearchTypeTab
                key={tab.key}
                isActive={searchType === tab.key}
                label={tab.label}
                onClick={() => handleSearchTypeChange(tab.key)}
              />
            ))}
          </div>

          {/* Search Results */}
          <div className="py-2">
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Spin size="small" /> Đang tìm kiếm...
              </div>
            ) : showEmptyState ? (
              <div className="px-4 py-8 text-center text-gray-500">
                Không tìm thấy kết quả nào
              </div>
            ) : hasResults ? (
              <>
                <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600">
                  {results.length} {SEARCH_CONFIGS[searchType].resultLabel} được
                  tìm thấy
                </div>

                {searchType === "user" &&
                  results.map((result) => (
                    <UserResultItem
                      key={result.id}
                      user={result as User}
                      onClick={handleResultClick}
                    />
                  ))}

                {searchType === "group" &&
                  results.map((result) => (
                    <GenericResultItem
                      key={result.id}
                      item={result}
                      onClick={handleResultClick}
                      title={result.name || ""}
                      subtitle={result.description || ""}
                    />
                  ))}

                {searchType === "post" &&
                  results.map((result) => (
                    <GenericResultItem
                      key={result.id}
                      item={result}
                      onClick={handleResultClick}
                      title={result.title || result.content || ""}
                      subtitle={result.content || ""}
                    />
                  ))}

                <div className="border-t mx-4 mt-2 pt-2">
                  <button
                    className="w-full text-left px-2 py-2 text-primary hover:bg-blue-50 rounded text-sm font-medium"
                    onClick={handleSearch}
                  >
                    Xem tất cả kết quả cho "{searchTerm}"
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
