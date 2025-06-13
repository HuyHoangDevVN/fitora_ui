import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";

// Fake dữ liệu mục tiêu/thống kê tháng cho dashboard khoa ~1000 sinh viên
const monthlyTargets = [
  {
    title: "Bài viết mục tiêu tháng này",
    value: 250,
    icon: "📝",
    color: "bg-green-500",
  },
  {
    title: "Nhóm học tập mới",
    value: 3,
    icon: "👥",
    color: "bg-purple-500",
  },
  {
    title: "Bình luận mục tiêu",
    value: 1200,
    icon: "💬",
    color: "bg-yellow-500",
  },
  {
    title: "Thành viên mới",
    value: 25,
    icon: "👤",
    color: "bg-blue-500",
  },
  {
    title: "Chủ đề mới",
    value: 2,
    icon: "🏷️",
    color: "bg-cyan-500",
  },
  {
    title: "Báo cáo cần xử lý",
    value: 1,
    icon: "🚩",
    color: "bg-red-500",
  },
];

export default function MonthlyTarget() {
  const series = [75.55];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 custom-dark:border-gray-800 custom-dark:bg-white/[0.03]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {monthlyTargets.map((item) => (
          <div
            key={item.title}
            className={`flex items-center gap-4 p-5 rounded-xl shadow bg-white dark:bg-gray-900 ${item.color}`}
          >
            <span className="text-3xl">{item.icon}</span>
            <div>
              <div className="text-lg font-semibol text-gray-800 custom-dark:text-white">
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 custom-dark:text-white/90">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
