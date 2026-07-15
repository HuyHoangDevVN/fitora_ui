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
    value: 1800,
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
    value: 200,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((item) => (
        <div
          key={item.title}
          className={`flex items-center gap-4 p-5 rounded-xl shadow bg-white dark:bg-gray-900 ${item.color}`}
        >
          <span className="text-3xl">{item.icon}</span>
          <div>
            <div className="text-lg font-semibold text-gray-800 custom-dark:text-white/90">
              {item.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 custom-dark:text-white/90">
              {item.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
