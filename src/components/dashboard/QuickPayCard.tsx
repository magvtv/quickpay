'use client';

import { useState } from 'react';
import { PencilIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '@/lib/utils';

interface QuickPayCardProps {
  username: string;
}

export default function QuickPayCard({ username }: QuickPayCardProps) {
  const [copied, setCopied] = useState(false);
  const quickPayUrl = `quickpay.to/${username}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(quickPayUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
        <div className="flex items-start gap-4">
          {/* QuickPay Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10h5l-6 8v-6H7l6-8v6z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-gray-900">
                {quickPayUrl}
              </h3>
              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mt-2 mb-3">
              Quickpay lets you receive payments on the fly. You can generate invoice or share the payment link to request the payment.
            </p>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>

      {/* Copy Toast */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 z-50">
          <CheckIcon className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">QuickPay link copied!</span>
        </div>
      )}
    </>
  );
}
