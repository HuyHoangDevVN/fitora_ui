import colors from "@/styles/colors";
import { Divider } from "antd";
import React from "react";
import { FaBookmark, FaChartLine, FaUserFriends } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";
import { RiHomeLine } from "react-icons/ri";
import ListLinkButton from "./components/ListLinkButton";
import { fakeGroupData } from "./fakeData";

const menuItems = [
  {
    icon: <RiHomeLine size={20} color={colors.primary} />,
    link: "/",
    title: "Trang chủ",
  },
  {
    icon: <FaUserFriends size={20} color={colors.primary} />,
    link: "/",
    title: "Bạn bè",
  },
  {
    icon: <FaBookmark size={20} color={colors.primary} />,
    link: "/",
    title: "Đã lưu",
  },
  {
    icon: <HiUserGroup size={20} color={colors.primary} />,
    link: "/",
    title: "Nhóm",
  },
  {
    icon: <FaChartLine size={20} color={colors.primary} />,
    link: "/",
    title: "Xu hướng",
  },
  {
    icon: <MdOutlineCategory size={20} color={colors.primary} />,
    link: "/",
    title: "Khám phá",
  },
];

const LeftSidebar: React.FC = () => (
  <div className="bg-background text-textPrimary p-4 pb-32 h-full max-w-[250px] fixed border overflow-y-auto">
    <ListLinkButton listItems={menuItems} />
    <Divider style={{ borderColor: colors.border, margin: "15px 0px" }} />
    <h2 className="text-[20] text-primary font-semibold mt-0 mb-6">
      Nhóm của bạn
    </h2>
    <ListLinkButton listItems={fakeGroupData} />
  </div>
);

export default LeftSidebar;
