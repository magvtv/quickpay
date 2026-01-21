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
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        {/* Left Side - Total Received */}
        <div className="flex-1">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            TOTAL RECEIVED
          </span>
          <div className="text-4xl font-bold text-gray-900 mt-2 mb-1">
            <span className="text-lg align-top">$</span>
            {formatCurrency(totalReceived, currency).replace('$', '').split('.')[0]}
            <span className="text-2xl text-gray-400">.{formatCurrency(totalReceived, currency).split('.')[1] || '00'}</span>
          </div>
          {changePercentage && (
            <p className="text-sm font-medium text-green-500">
              {changePercentage}
            </p>
          )}
        </div>

        {/* Right Side - Pending & Drafts */}
        <div className="flex flex-col gap-3 pl-6 border-l border-gray-100">
          {/* Pending */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-gray-500">Pending</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              ${formatCurrency(pendingAmount, currency).replace('$', '')}
            </div>
          </div>

          {/* In Drafts */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-xs font-medium text-gray-500">In drafts</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              ${formatCurrency(draftsAmount, currency).replace('$', '')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
