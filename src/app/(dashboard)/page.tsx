'use client';

import { useEffect } from 'react';
import QuickPayCard from '@/components/dashboard/QuickPayCard';
import TotalReceivedCard from '@/components/dashboard/TotalReceivedCard';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import { useInvoiceStore, useDashboardStats } from '@/stores/invoiceStore';

export default function DashboardPage() {
  const fetchInvoices = useInvoiceStore((state) => state.fetchInvoices);
  const isLoading = useInvoiceStore((state) => state.isLoading);
  const stats = useDashboardStats();

  // Fetch invoices on mount
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <div className="space-y-6">
      {/* Top Row - Stats Card and QuickPay Card side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        ) : (
          <TotalReceivedCard
            totalReceived={stats.totalReceived}
            changePercentage="+10% since last month"
            pendingAmount={stats.pending}
            draftsAmount={stats.drafts}
          />
        )}
        <QuickPayCard username="publicnote" />
      </div>

      {/* Invoice List */}
      <InvoiceTable />
    </div>
  );
}
