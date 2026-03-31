'use client';

import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import type { BenchmarkResult } from '@/types/benchmarks';

interface DetailedCompTableProps {
  data: BenchmarkResult;
}

export default function DetailedCompTable({ data }: DetailedCompTableProps) {
  if (!data.sufficient_data) {
    return (
      <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6 text-center">
        <p className="text-white/50">
          {data.suppression_reason === 'single_source_cap'
            ? 'Data suppressed: a single organizational profile represents more than 25% of submissions for this segment.'
            : 'Insufficient data for this filter combination. At least 5 submissions are required.'}
        </p>
        <p className="text-gold-500 text-sm mt-2">
          Be one of the first to contribute data for this segment.
        </p>
      </div>
    );
  }

  const isMedianOnly = data.disclosure_tier === 'median_only';

  const rows = [
    {
      label: 'Base Salary',
      p25: data.base_salary?.p25 ? formatCurrency(data.base_salary.p25) : '—',
      p50: data.base_salary ? formatCurrency(data.base_salary.p50) : '—',
      p75: data.base_salary?.p75 ? formatCurrency(data.base_salary.p75) : '—',
    },
    {
      label: 'Incentive Target (%)',
      p25: data.incentive_target_pct?.p25 ? formatPercentage(data.incentive_target_pct.p25) : '—',
      p50: data.incentive_target_pct ? formatPercentage(data.incentive_target_pct.p50) : '—',
      p75: data.incentive_target_pct?.p75 ? formatPercentage(data.incentive_target_pct.p75) : '—',
    },
    {
      label: 'Total Cash Compensation',
      p25: data.total_cash?.p25 ? formatCurrency(data.total_cash.p25) : '—',
      p50: data.total_cash ? formatCurrency(data.total_cash.p50) : '—',
      p75: data.total_cash?.p75 ? formatCurrency(data.total_cash.p75) : '—',
    },
  ];

  return (
    <div className="bg-navy-900/50 border border-white/10 rounded-xl overflow-hidden">
      <div className="p-6 pb-0">
        <h3 className="font-serif text-lg font-bold text-white mb-1">
          Detailed Percentile Breakdown
        </h3>
        <p className="text-sm text-white/40 mb-4">
          Based on {data.submission_count} submissions
          {isMedianOnly && (
            <span className="text-gold-500/70">
              {' '}· 25th/75th percentiles require 10+ submissions
            </span>
          )}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-white/10">
              <th className="text-left text-sm font-medium text-white/50 px-6 py-3">Metric</th>
              {!isMedianOnly && (
                <th className="text-right text-sm font-medium text-white/50 px-6 py-3">25th</th>
              )}
              <th className="text-right text-sm font-medium text-gold-500 px-6 py-3">Median</th>
              {!isMedianOnly && (
                <th className="text-right text-sm font-medium text-white/50 px-6 py-3">75th</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-white/5">
                <td className="text-sm text-white font-medium px-6 py-4">{row.label}</td>
                {!isMedianOnly && (
                  <td className="text-sm text-white/60 text-right px-6 py-4">{row.p25}</td>
                )}
                <td className="text-sm text-white font-bold text-right px-6 py-4">{row.p50}</td>
                {!isMedianOnly && (
                  <td className="text-sm text-white/60 text-right px-6 py-4">{row.p75}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
