'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { formatDate, formatCurrency } from '@/lib/utils';

interface InvoicePreviewData {
  invoice_number: string;
  client_name?: string;
  client_email?: string;
  issue_date: Date;
  due_date: Date;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
}

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: InvoicePreviewData | null;
}

export default function InvoicePreviewModal({ 
  isOpen, 
  onClose, 
  previewData 
}: InvoicePreviewModalProps) {
  if (!previewData) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header with Close Button */}
                <div className="flex items-center justify-end px-6 pt-4">
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Invoice Preview Content */}
                <div className="px-12 pb-8 max-h-[75vh] overflow-y-auto scrollbar-thin">
                  {/* Invoice Header - Number & Company */}
                  <div className="flex items-start justify-between mb-10">
                    {/* Left - Invoice Number & Label */}
                    <div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {previewData.invoice_number}
                      </h2>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        LEGAL CONSULTING
                      </p>
                    </div>

                    {/* Right - Company Logo & Address */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-base font-bold text-gray-900">
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
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Issued on
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(previewData.issue_date.toISOString(), 'long')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Due on
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(previewData.due_date.toISOString(), 'long')}
                      </p>
                    </div>
                  </div>

                  {/* Bill To Section */}
                  <div className="mb-10">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Invoice for
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {previewData.client_name || previewData.client_email || 'Client Name'}
                    </p>
                    <p className="text-sm text-gray-600">
                      3897 Hickory St, Salt Lake City<br />
                      Utah, United States 84104
                    </p>
                  </div>

                  {/* Line Items Table */}
                  <div className="mb-10">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                            Item
                          </th>
                          <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                            Qty
                          </th>
                          <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                            Price
                          </th>
                          <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {previewData.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-4 text-sm text-gray-900">
                              {item.description || 'Item description'}
                            </td>
                            <td className="py-4 text-sm text-gray-600 text-center">
                              {item.quantity}
                            </td>
                            <td className="py-4 text-sm text-gray-600 text-right">
                              {formatCurrency(item.unit_price)}
                            </td>
                            <td className="py-4 text-sm font-semibold text-gray-900 text-right">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Notes Section */}
                  {previewData.notes && (
                    <div className="mb-10 p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Additional Notes
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {previewData.notes}
                      </p>
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200 mb-8">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </span>
                    <span className="text-4xl font-bold text-gray-900">
                      {formatCurrency(previewData.total)}
                    </span>
                  </div>

                  {/* Download Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      DOWNLOAD INVOICE
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                      You can update your logo and invoice settings from payment settings
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-center px-8 py-6 bg-white border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="px-8 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors uppercase tracking-wide"
                  >
                    CLOSE
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
