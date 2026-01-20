'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useInvoiceStore } from '@/stores/invoiceStore';
import InvoiceRow from './InvoiceRow';

export default function InvoiceTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const { invoices, openModal } = useInvoiceStore();

  // Filter invoices based on search
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Invoices</h2>
        <p className="text-sm text-gray-600">
          List of all of your recent transactions.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search an invoice"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filter Dropdown */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-sm font-medium text-gray-700">Show all</span>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table-base">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">No.</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Client</th>
              <th className="table-header-cell text-right">Amount</th>
              <th className="table-header-cell text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  onClick={() => openModal(invoice)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
