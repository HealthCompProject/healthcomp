'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { EXECUTIVE_TITLES, NPR_RANGES, TAX_STATUSES, REGIONS } from '@/lib/constants/roles';

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [revenueRange, setRevenueRange] = useState(searchParams.get('revenue_range') || '');
  const [taxStatus, setTaxStatus] = useState(searchParams.get('tax_status') || '');
  const [region, setRegion] = useState(searchParams.get('region') || '');

  function applyFilters() {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (revenueRange) params.set('revenue_range', revenueRange);
    if (taxStatus) params.set('tax_status', taxStatus);
    if (region) params.set('region', region);

    router.push(`/dashboard?${params.toString()}`);
  }

  function clearFilters() {
    setTitle('');
    setRevenueRange('');
    setTaxStatus('');
    setRegion('');
    router.push('/dashboard');
  }

  const titleOptions = EXECUTIVE_TITLES.map((t) => ({ value: t, label: t }));

  return (
    <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6">
      <h3 className="font-serif text-lg font-bold text-white mb-4">
        Filter Benchmarks
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Role"
          options={titleOptions}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="All roles"
        />
        <Select
          label="Organization Size"
          options={[...NPR_RANGES]}
          value={revenueRange}
          onChange={(e) => setRevenueRange(e.target.value)}
          placeholder="All sizes"
        />
        <Select
          label="Tax Status"
          options={[...TAX_STATUSES]}
          value={taxStatus}
          onChange={(e) => setTaxStatus(e.target.value)}
          placeholder="All"
        />
        <Select
          label="Region"
          options={[...REGIONS]}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="All regions"
        />
      </div>
      <div className="flex gap-3 mt-4">
        <Button size="sm" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button size="sm" variant="ghost" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}
