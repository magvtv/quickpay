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
//   const statusColors = {
//     pending: 'text-blue-600',
//     paid: 'text-green-600',
//     draft: 'text-orange-500',
//   };

  const statusConfig: Record<'pending' | 'paid' | 'draft', { dotColor: string; amountColor: string }> = {
    pending: {
        dotColor: 'bg-blue-500',
        amountColor: 'text-blue-600',
    },
    paid: {
        dotColor: 'bg-green-500',
        amountColor: 'text-green-600',
    },
    draft: {
        dotColor: 'bg-orange-500',
        amountColor: 'text-orange-500',
    }
  };

  const config = status ? statusConfig[status] : null;

//   const statusDots = {
//     pending: 'bg-blue-500',
//     paid: 'bg-green-500',
//     draft: 'bg-orange-500',
//   };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Label with optional status dot */}
      <div className="flex items-center gap-2 mb-3">
        
        {config && (
            <span className={cn('w-2 h-2 rounded-full', config.dotColor)} />
        )}
        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Amount - Different sizes for main vs secondary cards */}
      <div className={cn(
        'font-semibold mb-2',
        isLarge ? 'text-5xl' : 'text-3xl',
        config ? config.amountColor : 'text-gray-900'
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
