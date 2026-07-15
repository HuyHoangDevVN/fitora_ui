import DemographicCard from "@/components/dashbroadAdmin/DemographicCard";
import EcommerceMetrics from "@/components/dashbroadAdmin/Metrics";
import MonthlySalesChart from "@/components/dashbroadAdmin/MonthlySalesChart";
import MonthlyTarget from "@/components/dashbroadAdmin/MonthlyTarget";
import RecentOrders from "@/components/dashbroadAdmin/RecentOrders";
import StatisticsChart from "@/components/dashbroadAdmin/StatisticsChart";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
};

export default AdminDashboard;
