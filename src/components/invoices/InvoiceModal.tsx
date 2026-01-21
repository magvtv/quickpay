'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function InvoiceModal() {
  const { selectedInvoice, isModalOpen, closeModal } = useInvoiceStore();

  if (!selectedInvoice) return null;

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Invoice Details
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Invoice Content */}
                <div className="px-8 py-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
                  {/* Invoice Header - Company Info & Logo */}
                  <div className="flex items-start justify-between mb-8">
                    {/* Left - Invoice Number & Label */}
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        {selectedInvoice.invoice_number}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        LEGAL CONSULTING
                      </p>
                    </div>

                    {/* Right - Company Logo & Address */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          public note
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        340 S LEMON AVE #1950<br />
                        Walnut, California<br />
                        United States 91789
                      </p>
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Issued on
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(selectedInvoice.issue_date || selectedInvoice.created_at, 'long')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Due on
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(selectedInvoice.due_date, 'long')}
                      </p>
                    </div>
                  </div>

                  {/* Bill To Section */}
                  <div className="mb-8">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Invoice for
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedInvoice.client_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      3897 Hickory St, Salt Lake City<br />
                      Utah, United States 84104
                    </p>
                  </div>

                  {/* Line Items Table */}
                  <div className="mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                            Item
                          </th>
                          <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                            Qty
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                            Price
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {/* Sample items - replace with actual invoice_items */}
                        <tr>
                          <td className="py-4 text-sm text-gray-900">Legal Advising</td>
                          <td className="py-4 text-sm text-gray-600 text-center">2</td>
                          <td className="py-4 text-sm text-gray-600 text-right">$500</td>
                          <td className="py-4 text-sm font-semibold text-gray-900 text-right">$1000</td>
                        </tr>
                        <tr>
                          <td className="py-4 text-sm text-gray-900">Expert Consulting</td>
                          <td className="py-4 text-sm text-gray-600 text-center">1</td>
                          <td className="py-4 text-sm text-gray-600 text-right">$400</td>
                          <td className="py-4 text-sm font-semibold text-gray-900 text-right">$400</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Notes Section */}
                  {selectedInvoice.notes && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Additional Notes
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedInvoice.notes}
                      </p>
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(selectedInvoice.total)}
                    </span>
                  </div>

                  {/* Download Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      DOWNLOAD INVOICE
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      You can update your logo and invoice settings from payment settings
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 px-8 py-6 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    CLOSE
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    SEND INVOICE
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
