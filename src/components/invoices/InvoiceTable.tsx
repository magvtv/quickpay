'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useInvoiceStore } from '@/stores/invoiceStore';
import InvoiceRow from './InvoiceRow';

export default function InvoiceTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const { invoices, openModal, openDrawer } = useInvoiceStore();

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      {/* Header with Title and New Invoice Button */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Invoices</h2>
          <p className="text-sm text-gray-500">
            List of all of your recent transactions.
          </p>
        </div>
        
        <button
          onClick={openDrawer}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase tracking-wide text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <PlusIcon className="w-5 h-5" />
          NEW INVOICE
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search an invoice"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Show All Dropdown */}
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
          Show all
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">No invoices found</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first invoice to get started</p>
                  </div>
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
