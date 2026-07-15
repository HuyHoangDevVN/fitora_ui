import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: "2 Variants",
    category: "Laptop",
    price: "$2399.00",
    status: "Delivered",
    image: "/images/product/product-01.jpg", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: "1 Variant",
    category: "Watch",
    price: "$879.00",
    status: "Pending",
    image: "/images/product/product-02.jpg", // Replace with actual image URL
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: "2 Variants",
    category: "SmartPhone",
    price: "$1869.00",
    status: "Delivered",
    image: "/images/product/product-03.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    category: "Electronics",
    price: "$1699.00",
    status: "Canceled",
    image: "/images/product/product-04.jpg", // Replace with actual image URL
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    category: "Accessories",
    price: "$240.00",
    status: "Delivered",
    image: "/images/product/product-05.jpg", // Replace with actual image URL
  },
];

// Fake dữ liệu hoạt động gần đây cho dashboard mạng xã hội học tập
const recentActivities = [
  {
    type: "Bài viết mới",
    user: "Nguyễn Việt Hoàng",
    content: "Chia sẻ về phương pháp học hiệu quả cho kỳ thi cuối kỳ.",
    time: "5 phút trước",
    icon: "📝",
  },
  {
    type: "Bình luận",
    user: "Trần Thị Ly",
    content: "Bài viết rất hữu ích, cảm ơn bạn!",
    time: "10 phút trước",
    icon: "💬",
  },
  {
    type: "Nhóm học tập mới",
    user: "Lê Văn Mạnh",
    content: "Nhóm 'Lập trình Python cơ bản' vừa được tạo.",
    time: "30 phút trước",
    icon: "👥",
  },
  {
    type: "Báo cáo vi phạm",
    user: "Admin",
    content: "1 bài viết bị báo cáo vi phạm nội quy.",
    time: "1 giờ trước",
    icon: "🚩",
  },
  {
    type: "Bài viết mới",
    user: "Phạm Thị Chúc",
    content: "Tổng hợp tài liệu ôn tập môn Toán rời rạc.",
    time: "2 giờ trước",
    icon: "📝",
  },
  {
    type: "Bình luận",
    user: "Ngô Văn Quân",
    content: "Có ai có đáp án đề thi năm ngoái không?",
    time: "3 giờ trước",
    icon: "💬",
  },
];

// Ví dụ render:
export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 custom-dark:border-gray-800 custom-dark:bg-white/[0.03] sm:px-6">
      <div className="mt-8">
        <div className="font-semibold text-lg mb-4">Hoạt động gần đây</div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {recentActivities.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 py-3">
              <span className="text-2xl mt-1">{item.icon}</span>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  {item.user}{" "}
                  <span className="text-xs text-gray-500">({item.type})</span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                  {item.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">{item.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
