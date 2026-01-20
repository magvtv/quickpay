import QuickPayCard from '@/components/dashboard/QuickPayCard';
import StatsCard from '@/components/dashboard/StatsCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            label="Total Revenue"
            amount={125430}
            change="+12.5% from last month"
            status="paid"
          />
          <StatsCard
            label="Pending Payments"
            amount={3420}
            change="+5.2% from last month"
            status="pending"
          />
          <StatsCard
            label="Draft Invoices"
            amount={850}
            status="draft"
          />
        </div>

        {/* QuickPay Card */}
        <QuickPayCard username="yourcompany" />
      </div>
    </div>
  );
}
