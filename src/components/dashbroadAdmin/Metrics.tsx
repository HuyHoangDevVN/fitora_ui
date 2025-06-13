import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import Badge from "../ui/badge/Badge";

// Fake metrics cho dashboard mạng xã hội học tập quy mô khoa ~1000 sinh viên
const metrics = [
  {
    title: "Tổng số sinh viên",
    value: 980,
    icon: "👤",
    color: "bg-blue-500",
  },
  {
    title: "Bài viết đã đăng",
    value: 3120,
    icon: "📝",
    color: "bg-green-500",
  },
  {
    title: "Nhóm học tập",
    value: 24,
    icon: "👥",
    color: "bg-purple-500",
  },
  {
    title: "Bình luận",
    value: 15800,
    icon: "💬",
    color: "bg-yellow-500",
  },
  {
    title: "Lượt tương tác",
    value: 41200,
    icon: "👍",
    color: "bg-pink-500",
  },
  {
    title: "Lượt truy cập tháng này",
    value: 7200,
    icon: "📈",
    color: "bg-orange-500",
  },
  {
    title: "Chủ đề học tập",
    value: 12,
    icon: "🏷️",
    color: "bg-cyan-500",
  },
  {
    title: "Báo cáo vi phạm",
    value: 3,
    icon: "🚩",
    color: "bg-red-500",
  },
];

export default function Metrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 custom-dark:border-gray-800 custom-dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl custom-dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 custom-dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 custom-dark:text-gray-400">
              Khách hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm custom-dark:text-white/90">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 custom-dark:border-gray-800 custom-dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl custom-dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 custom-dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 custom-dark:text-gray-400">
              Đơn hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm custom-dark:text-white/90">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* Ví dụ render metrics mới */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((item) => (
          <div
            key={item.title}
            className={`flex items-center gap-4 p-5 rounded-xl shadow bg-white dark:bg-gray-900 ${item.color}`}
          >
            <span className="text-3xl">{item.icon}</span>
            <div>
              <div className="text-lg font-semibold text-white">
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm text-white/80">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
