import { cn, formatCurrency } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  amount: number;
  change?: string;
  status?: 'pending' | 'paid' | 'draft';
  currency?: string;
  isLarge?: boolean;
}

export default function StatsCard({
  label,
  amount,
  change,
  status,
  currency = 'USD',
  isLarge = false,
}: StatsCardProps) {
  const statusColors = {
    pending: 'text-blue-600',
    paid: 'text-green-600',
    draft: 'text-orange-500',
  };

  const statusConfig = {
    pending: {
        dotColor: 'bg-blue-500',
        amountColor: 'text-blue-600',
    },
    draft: {
        dotColor: 'bg-orange-500',
        amountCoolor: 'text-orange-500',
    }
  }

  const statusDots = {
    pending: 'bg-blue-500',
    paid: 'bg-green-500',
    draft: 'bg-orange-500',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Label with Status Indicator */}
      <div className="flex items-center gap-2 mb-2">
        {status && (
          <span className={cn('w-2 h-2 rounded-full', statusDots[status])} />
        )}
        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Amount */}
      <div className={cn(
        'text-3xl font-semibold mb-1',
        status ? statusColors[status] : 'text-gray-900'
      )}>
        {formatCurrency(amount, currency)}
      </div>

      {/* Change Indicator */}
      {change && (
        <p className="text-sm font-medium text-green-600">
          {change}
        </p>
      )}
    </div>
  );
}
