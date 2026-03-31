'use client';

import Card from '@/components/ui/Card';
import type { BenchmarkResult } from '@/types/benchmarks';

interface PrevalenceStatsProps {
  data: BenchmarkResult | null;
}

interface PrevalenceStat {
  label: string;
  value: number | undefined;
  description: string;
}

export default function PrevalenceStats({ data }: PrevalenceStatsProps) {
  const stats: PrevalenceStat[] = [
    {
      label: 'Deferred Compensation',
      value: data?.has_deferred_comp_pct,
      description: 'have a deferred comp plan beyond 401(k)/403(b)',
    },
    {
      label: 'Long-Term Incentive',
      value: data?.has_ltip_pct,
      description: 'have a multi-year incentive plan',
    },
    {
      label: 'Equity Compensation',
      value: data?.has_equity_comp_pct,
      description: 'receive RSUs, PSUs, or other stock-based comp',
    },
    {
      label: 'Employment Agreement',
      value: data?.has_employment_agreement_pct,
      description: 'have a formal employment agreement with severance',
    },
  ];

  return (
    <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6">
      <h3 className="font-serif text-lg font-bold text-white mb-6">
        Benefit Prevalence
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="relative w-20 h-20 mx-auto mb-3">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3"
                  strokeDasharray={`${stat.value ?? 0}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {stat.value != null ? `${Math.round(stat.value)}%` : '—'}
              </span>
            </div>
            <p className="text-sm font-medium text-white text-center">{stat.label}</p>
            <p className="text-xs text-white/40 text-center mt-1">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
