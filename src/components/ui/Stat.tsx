import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';

interface StatProps {
  label: string;
  value: number | null | undefined;
  format?: 'currency' | 'percentage' | 'number';
  sublabel?: string;
  className?: string;
}

export default function Stat({
  label,
  value,
  format = 'currency',
  sublabel,
  className = '',
}: StatProps) {
  const formattedValue =
    value == null
      ? '—'
      : format === 'currency'
        ? formatCurrency(value)
        : format === 'percentage'
          ? formatPercentage(value)
          : value.toLocaleString();

  return (
    <div className={className}>
      <p className="text-sm font-medium text-white/60 mb-1">{label}</p>
      <p className="text-3xl font-bold font-serif text-white tracking-tight">
        {formattedValue}
      </p>
      {sublabel && (
        <p className="text-sm text-white/40 mt-1">{sublabel}</p>
      )}
    </div>
  );
}
