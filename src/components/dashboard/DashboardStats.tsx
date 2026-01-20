'use client';

import { useEffect } from 'react';
import { useInvoiceStore } from '@/stores/invoiceStore';
import StatsCard from './StatsCard';
import QuickPayCard from './QuickPayCard';

export default function DashboardStats() {
  const { invoices, fetchInvoices } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Calculate stats
  const totalReceived = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pending = invoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const drafts = invoices
    .filter((inv) => inv.status === 'draft')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid - Matching original layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Card - Total Received */}
        <div className="lg:col-span-1">
          <StatsCard
            label="TOTAL RECEIVED"
            amount={totalReceived}
            change="+12.5% from last month"
            isLarge
          />
        </div>

        {/* Two smaller cards side by side */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatsCard
            label="PENDING PAYMENTS"
            amount={pending}
            status="pending"
            change="+5.2% from last month"
          />
          <StatsCard
            label="DRAFT INVOICES"
            amount={drafts}
            status="draft"
          />
        </div>
      </div>

      {/* QuickPay Card */}
      <QuickPayCard username="yourcompany" />
    </div>
  );
}
