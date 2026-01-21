'use client';

import { formatCurrency } from '@/lib/utils';

interface TotalReceivedCardProps {
  totalReceived: number;
  changePercentage?: string;
  pendingAmount: number;
  draftsAmount: number;
  currency?: string;
}

export default function TotalReceivedCard({
  totalReceived,
  changePercentage = '+10% since last month',
  pendingAmount,
  draftsAmount,
  currency = 'USD',
}: TotalReceivedCardProps) {
  const formattedTotal = formatCurrency(totalReceived, currency);
  const [dollars, cents] = formattedTotal.replace('$', '').split('.');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-6">
        {/* Left Side - Total Received */}
        <div className="flex-shrink-0">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-3">
            TOTAL RECEIVED
          </span>
          <div className="text-4xl font-bold text-gray-900 mb-2 leading-none">
            <span className="text-xl">$</span>
            {dollars}
            <span className="text-2xl text-gray-400">.{cents || '00'}</span>
          </div>
          {changePercentage && (
            <p className="text-sm font-medium text-green-500">
              {changePercentage}
            </p>
          )}
        </div>

        {/* Right Side - Pending & Drafts */}
        <div className="flex flex-col gap-4 pl-6 border-l border-gray-200 flex-shrink-0">
          {/* Pending */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-gray-600">Pending</span>
            </div>
            <div className="text-base font-semibold text-gray-900">
              ${formatCurrency(pendingAmount, currency).replace('$', '')}
            </div>
          </div>

          {/* In Drafts */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-xs font-medium text-gray-600">In drafts</span>
            </div>
            <div className="text-base font-semibold text-gray-900">
              ${formatCurrency(draftsAmount, currency).replace('$', '')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
