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
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <div className="flex items-start justify-between">
          {/* Left side - Icon and content */}
          <div className="flex items-start gap-4">
            {/* QuickPay Icon */}
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10h5l-6 8v-6H7l6-8v6z" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {quickPayUrl}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3 max-w-2xl">
                Quickpay lets you receive payments on the fly. You can generate invoice or share the payment link to request the payment.
              </p>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2 ml-4">
            <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-600" />
              ) : (
                <DocumentDuplicateIcon className="w-5 h-5" />
              )}
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
