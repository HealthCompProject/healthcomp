'use client';

import Card from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import type { BenchmarkResult } from '@/types/benchmarks';

interface HeadlineStatsProps {
  data: BenchmarkResult | null;
  submissionCount: number;
}

export default function HeadlineStats({ data, submissionCount }: HeadlineStatsProps) {
  const stats = [
    {
      label: 'Median Base Salary',
      value: data?.base_salary?.p50 ? formatCurrency(data.base_salary.p50) : '—',
      sublabel: 'All roles combined',
    },
    {
      label: 'Median Total Cash',
      value: data?.total_cash?.p50 ? formatCurrency(data.total_cash.p50) : '—',
      sublabel: 'Base + incentive',
    },
    {
      label: 'Median Incentive Target',
      value: data?.incentive_target_pct?.p50 ? formatPercentage(data.incentive_target_pct.p50) : '—',
      sublabel: 'As % of base salary',
    },
    {
      label: 'Submissions',
      value: submissionCount.toLocaleString(),
      sublabel: 'Contributing executives',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} accent>
          <p className="text-sm font-medium text-white/60 mb-1">{stat.label}</p>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            {stat.value}
          </p>
          <p className="text-xs text-white/40 mt-1">{stat.sublabel}</p>
        </Card>
      ))}
    </div>
  );
}
