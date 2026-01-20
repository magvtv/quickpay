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
    <tr className="table-row" onClick={onClick}>
      <td className="table-cell">
        <span className="font-medium text-gray-900">{invoice.invoice_number}</span>
      </td>
      <td className="table-cell text-gray-600">
        {formatDate(invoice.issue_date, 'short')}
      </td>
      <td className="table-cell">
        <div>
          <div className="font-medium text-gray-900">
            {invoice.client_name || 'N/A'}
          </div>
          {invoice.client_email && (
            <div className="text-sm text-gray-500">{invoice.client_email}</div>
          )}
        </div>
      </td>
      <td className="table-cell text-right font-medium text-gray-900">
        {formatCurrency(invoice.total)}
      </td>
      <td className="table-cell text-right">
        <div className="flex justify-end">
          <StatusBadge status={invoice.status} />
        </div>
      </td>
    </tr>
  );
}
