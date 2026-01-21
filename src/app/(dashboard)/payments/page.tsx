'use client';

import DashboardStats from '@/components/dashboard/DashboardStats';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import InvoiceModal from '@/components/invoices/InvoiceModal';
import InvoiceDrawer from '@/components/invoices/InvoiceDrawer';
import { useEffect } from 'react';
import { useInvoiceStore } from '@/stores/invoiceStore';

export default function PaymentsPage() {
  const fetchInvoices = useInvoiceStore((state) => state.fetchInvoices);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <>
      <div className="space-y-8">
        {/* Stats and QuickPay Section */}
        <section>
          <DashboardStats />
        </section>

        {/* Invoices Table Section */}
        <section>
          <InvoiceTable />
        </section>
      </div>

      {/* Modals */}
      <InvoiceModal />
      <InvoiceDrawer />
    </>
  );
}
