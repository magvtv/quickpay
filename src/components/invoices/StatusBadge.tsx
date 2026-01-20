import { cn } from '@/lib/utils';
import { CheckIcon } from '@heroicons/react/24/solid';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: 'Draft',
      dotColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      icon: null,
    },
    sent: {
      label: 'Pending',
      dotColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      icon: null,
    },
    paid: {
      label: 'Paid',
      dotColor: 'bg-green-500',
      textColor: 'text-green-600',
      icon: CheckIcon,
    },
    overdue: {
      label: 'Overdue',
      dotColor: 'bg-red-500',
      textColor: 'text-red-600',
      icon: null,
    },
    cancelled: {
      label: 'Cancelled',
      dotColor: 'bg-gray-400',
      textColor: 'text-gray-500',
      icon: null,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      {Icon ? (
        <Icon className={cn('w-4 h-4', config.textColor)} />
      ) : (
        <span className={cn('w-2 h-2 rounded-full', config.dotColor)} />
      )}
      <span className={cn('text-sm font-medium', config.textColor)}>
        {config.label}
      </span>
    </div>
  );
}
