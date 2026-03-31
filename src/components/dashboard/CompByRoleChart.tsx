'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCompact, formatCurrency } from '@/lib/utils/formatting';
import type { RoleBenchmark } from '@/types/benchmarks';

interface CompByRoleChartProps {
  data: RoleBenchmark[];
  metric: 'baseSalary' | 'totalCash';
  title: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-navy-900 border border-white/10 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm text-white/70">
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function CompByRoleChart({ data, metric, title }: CompByRoleChartProps) {
  const chartData = data
    .filter((d) => d[metric] !== null)
    .map((d) => ({
      name: d.roleLabel,
      P25: d[metric]?.p25 ?? undefined,
      P50: d[metric]?.p50 || 0,
      P75: d[metric]?.p75 ?? undefined,
    }));

  // Check if any rows have p25/p75 data
  const hasPercentileRange = chartData.some((d) => d.P25 != null && d.P75 != null);

  if (chartData.length === 0) {
    return (
      <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6">
        <h3 className="font-serif text-lg font-bold text-white mb-4">{title}</h3>
        <p className="text-white/40 text-sm">Insufficient data to display this chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6">
      <h3 className="font-serif text-lg font-bold text-white mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            tickFormatter={formatCompact}
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={60}
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          />
          {hasPercentileRange && (
            <Bar dataKey="P25" fill="rgba(217,119,6,0.3)" name="25th Percentile" radius={[0, 2, 2, 0]} />
          )}
          <Bar dataKey="P50" fill="#d97706" name="Median" radius={[0, 2, 2, 0]} />
          {hasPercentileRange && (
            <Bar dataKey="P75" fill="rgba(217,119,6,0.6)" name="75th Percentile" radius={[0, 2, 2, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
