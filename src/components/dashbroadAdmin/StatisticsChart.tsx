import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { Pie, Gauge } from "@ant-design/charts";

// Fake dữ liệu cho biểu đồ thống kê mạng xã hội học tập quy mô khoa ~1000 sinh viên
const topicStats = [
  { name: "Toán ứng dụng", value: 420 },
  { name: "Lập trình", value: 320 },
  { name: "Tiếng Anh chuyên ngành", value: 180 },
  { name: "Kỹ năng mềm", value: 90 },
  { name: "Chủ đề khác", value: 110 },
];

const groupActiveRate = 0.78; // 78% nhóm học tập hoạt động
const studentJoinRate = 0.92; // 92% sinh viên tham gia ít nhất 1 nhóm học tập

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Revenue",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 custom-dark:border-gray-800 custom-dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 custom-dark:text-white/90">
            Thống kê
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm custom-dark:text-gray-400">
            Mục tiêu bạn đã đặt cho từng tháng
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <div className="font-semibold text-lg mb-2 custom-dark:text-white">
            Tỉ lệ bài viết theo chủ đề học tập
          </div>
          <Pie
            data={topicStats}
            angleField="value"
            colorField="name"
            radius={0.9}
            label={{ type: "outer", content: "{name}: {value}" }}
            legend={{ position: "bottom" }}
          />
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <div className="font-semibold mb-2 custom-dark:text-white">
              Tỉ lệ nhóm học tập hoạt động
            </div>
            <Gauge
              percent={groupActiveRate}
              range={{ color: "#52c41a" }}
              indicator={{ pointer: { style: { stroke: "#52c41a" } } }}
              statistic={{
                title: { formatter: () => "Nhóm học tập hoạt động" },
                content: {
                  formatter: () => `${Math.round(groupActiveRate * 100)}%`,
                  style: { color: "#52c41a", fontSize: 24 },
                },
              }}
            />
          </div>
          <div>
            <div className="font-semibold mb-2 custom-dark:text-white">
              Tỉ lệ sinh viên tham gia nhóm học tập
            </div>
            <Gauge
              percent={studentJoinRate}
              range={{ color: "#1677ff" }}
              indicator={{ pointer: { style: { stroke: "#1677ff" } } }}
              statistic={{
                title: { formatter: () => "Sinh viên tham gia nhóm" },
                content: {
                  formatter: () => `${Math.round(studentJoinRate * 100)}%`,
                  style: { color: "#1677ff", fontSize: 24 },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
