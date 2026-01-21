'use client';

import { useEffect } from 'react';
import { useInvoiceStore } from '@/stores/invoiceStore';
import TotalReceivedCard from './TotalReceivedCard';
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
    <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] gap-6">
      {/* Total Received Card with Pending & Drafts */}
      <TotalReceivedCard
        totalReceived={totalReceived}
        changePercentage="+10% since last month"
        pendingAmount={pending}
        draftsAmount={drafts}
      />

      {/* QuickPay Card - Side by side */}
      <QuickPayCard username="publicnote" />
    </div>
  );
}
