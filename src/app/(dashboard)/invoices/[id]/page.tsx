import { notFound } from 'next/navigation';
import { createServerSupabaseClient, Tables } from '@/lib/supabase';
import { formatDate, formatCurrency } from '@/lib/utils';

interface InvoicePageProps {
  params: {
    id: string;
  };
}

type Invoice = Tables<'invoices'>;

export default async function PublicInvoicePage({ params }: InvoicePageProps) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    notFound();
  }

  // Now data is properly typed as Invoice after the null check
  const invoice: Invoice = data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Invoice from Public Note
            </h1>
            <p className="text-sm text-gray-600">
              Here we can write some notes for this client to get a better idea
            </p>
          </div>

          {/* Invoice Content */}
          <div className="space-y-8">
            {/* Invoice Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {invoice.invoice_number}
                </h2>
                <p className="text-sm text-gray-500 uppercase tracking-wider">
                  LEGAL CONSULTING
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg" />
                  <span className="text-lg font-bold">public note</span>
                </div>
                <p className="text-xs text-gray-600">
                  340 S LEMON AVE #1950<br />
                  Walnut, California<br />
                  United States 91789
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Issued on</p>
                <p className="font-semibold">{formatDate(invoice.created_at, 'long')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Due on</p>
                <p className="font-semibold">{formatDate(invoice.due_date, 'long')}</p>
              </div>
            </div>

            {/* Bill To */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Invoice for</p>
              <p className="font-semibold text-gray-900">{invoice.client_name}</p>
              <p className="text-sm text-gray-600">
                3897 Hickory St, Salt Lake City<br />
                Utah, United States 84104
              </p>
            </div>

            {/* Items Table */}
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs text-gray-500 uppercase pb-3">Item</th>
                  <th className="text-center text-xs text-gray-500 uppercase pb-3">Qty</th>
                  <th className="text-right text-xs text-gray-500 uppercase pb-3">Price</th>
                  <th className="text-right text-xs text-gray-500 uppercase pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3">Legal Advising</td>
                  <td className="py-3 text-center">2</td>
                  <td className="py-3 text-right">$500</td>
                  <td className="py-3 text-right font-semibold">$1000</td>
                </tr>
                <tr>
                  <td className="py-3">Expert Consulting</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">$400</td>
                  <td className="py-3 text-right font-semibold">$400</td>
                </tr>
              </tbody>
            </table>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{invoice.notes}</p>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <span className="text-sm text-gray-500 uppercase">Total Amount</span>
              <span className="text-3xl font-bold">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-semibold mb-4">Pay this Invoice</h3>
          <p className="text-sm text-gray-600 mb-6">
            Make payment for this invoice by filling in the details.
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Card number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM / YY"
                className="px-4 py-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="CVC"
                className="px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="button"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 uppercase tracking-wide"
            >
              MORE PAYMENT METHODS
            </button>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              PAY {formatCurrency(invoice.total)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
