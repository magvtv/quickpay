'use client';

import { useState } from 'react';
import { PencilIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '@/lib/utils';

interface QuickPayCardProps {
  username: string;
  description?: string;
}

export default function QuickPayCard({ username, description }: QuickPayCardProps) {
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* QuickPay Branding */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10h5l-6 8v-6H7l6-8v6z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">quickpay.to/{username}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {description || 'Quickpay lets you receive payments on the fly. You can generate invoice or share the payment link to request the payment.'}
          </p>
          <button className="text-sm text-primary font-medium mt-2 hover:underline">
            LEARN MORE
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleCopy}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          {copied ? (
            <CheckIcon className="w-5 h-5 text-green-600" />
          ) : (
            <DocumentDuplicateIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Copy Confirmation Toast */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom">
          <CheckIcon className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">QuickPay link copied!</span>
        </div>
      )}
    </div>
  );
}
