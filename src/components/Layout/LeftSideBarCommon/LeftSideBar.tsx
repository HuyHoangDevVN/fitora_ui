import React, { useEffect, useState } from "react";
import { Avatar, Divider } from "antd";
import { FaBookmark, FaChartLine, FaUserFriends } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";
import { RiHomeLine } from "react-icons/ri";
import colors from "@/styles/colors";
import ListLinkButton from "./components/ListLinkButton";
import { groupApi } from "@/api/groupApi";
import { GroupResponse } from "@/types/group";

const LeftSidebar: React.FC = () => {
  const userId = localStorage.getItem("x-client-id") || "0";
  const [groupData, setGroupData] = useState<GroupResponse[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const menuItems = [
    {
      icon: <RiHomeLine size={20} color={colors.primary} />,
      link: `/profile/${userId}`,
      title: "Trang chủ",
    },
    {
      icon: <FaUserFriends size={20} color={colors.primary} />,
      link: "/friend-requests",
      title: "Bạn bè",
    },
    {
      icon: <FaBookmark size={20} color={colors.primary} />,
      link: "/saved",
      title: "Đã lưu",
    },
    {
      icon: <HiUserGroup size={20} color={colors.primary} />,
      link: "/groups",
      title: "Nhóm",
    },
    {
      icon: <FaChartLine size={20} color={colors.primary} />,
      link: "/trending",
      title: "Xu hướng",
    },
    {
      icon: <MdOutlineCategory size={20} color={colors.primary} />,
      link: "/explore",
      title: "Khám phá",
    },
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await groupApi.getJoinedGroups({
          IsAll: true,
          PageIndex: pageIndex,
          PageSize: 6,
        });
        setGroupData((prev) => {
          const newGroups = response.data.filter(
            (group) =>
              !prev.some((existingGroup) => existingGroup.id === group.id)
          );
          return [...prev, ...newGroups];
        });
        setHasMore(response.data.length > 0);
      } catch (error) {
        console.error("Failed to fetch groups", error);
      }
    };

    fetchGroups();
  }, [pageIndex]);

  const loadMoreGroups = () => {
    if (hasMore) {
      setPageIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-background text-textPrimary p-4 pb-32 h-full max-w-[250px] left-0 sticky top-0 overflow-y-auto">
      <ListLinkButton listItems={menuItems} />
      <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
      <h2 className="text-[20px] text-primary font-semibold mt-0 mb-6">
        Nhóm của bạn
      </h2>
      <ListLinkButton
        listItems={groupData?.map((group) => ({
          icon: (
            <Avatar
              size={20}
              src={group?.avatarUrl || undefined}
              style={{ backgroundColor: colors.primary, fontSize: 12 }}
            >
              {!group?.avatarUrl && (group?.name?.[0] || "N")}
            </Avatar>
          ),
          title: group.name ?? "Unknown Group",
          link: `/groups/${group.id}`,
        }))}
        onLoadMore={loadMoreGroups}
        hasMore={hasMore}
      />
    </div>
  );
};

export default LeftSidebar;
