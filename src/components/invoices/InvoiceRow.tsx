import { formatDate, formatCurrency } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import type { Database } from '@/types/database';

type Invoice = Database['public']['Tables']['invoices']['Row'];

interface InvoiceRowProps {
  invoice: Invoice;
  onClick: () => void;
}

export default function InvoiceRow({ invoice, onClick }: InvoiceRowProps) {
  return (
    <tr 
      className="hover:bg-gray-50/50 cursor-pointer transition-colors border-t border-gray-100 first:border-t-0"
      onClick={onClick}
      style={{ borderSpacing: '0 8px' }}
    >
      {/* Invoice Number */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-900">
          {invoice.invoice_number}
        </span>
      </td>

      {/* Date */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span className="text-sm text-gray-600">
          {formatDate(invoice.created_at, 'short')}
        </span>
      </td>

      {/* Client */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {invoice.client_name || 'Unknown Client'}
          </p>
          {invoice.client_email && (
            <p className="text-xs text-gray-500 mt-0.5">
              {invoice.client_email}
            </p>
          )}
        </div>
      </td>

      {/* Amount */}
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <span className="text-lg font-semibold text-gray-900">
          {(() => {
            const formatted = formatCurrency(invoice.total);
            const [dollars, cents] = formatted.split('.');
            return (
              <>
                {dollars}
                {cents && (
                  <span className="text-gray-400 text-base">.{cents}</span>
                )}
              </>
            );
          })()}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <StatusBadge status={invoice.status} />
      </td>
    </tr>
  );
}
