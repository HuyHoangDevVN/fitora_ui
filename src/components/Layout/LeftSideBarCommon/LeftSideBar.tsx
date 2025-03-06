import React from "react";
import { Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { RiHomeLine } from "react-icons/ri";
import { FaUserFriends, FaBookmark, FaChartLine } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";
import colors from "@/styles/colors";
import ListLinkButton from "./components/ListLinkButton";
import { fakeGroupData } from "./fakeData";

const LeftSidebar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <RiHomeLine size={20} color={colors.primary} />,
      link: "/personal",
      title: "Trang chủ",
      onClick: () => navigate("/personal"),
    },
    {
      icon: <FaUserFriends size={20} color={colors.primary} />,
      link: "/friend-requests",
      title: "Bạn bè",
      onClick: () => navigate("/friend-requests"),
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

  return (
    <div className="bg-background text-textPrimary p-4 pb-32 h-full max-w-[250px] left-0 sticky top-0 overflow-y-auto">
      <ListLinkButton listItems={menuItems} />
      <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
      <h2 className="text-[20px] text-primary font-semibold mt-0 mb-6">
        Nhóm của bạn
      </h2>
      <ListLinkButton listItems={fakeGroupData} />
    </div>
  );
};

export default LeftSidebar;
