import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeadlineStats from '@/components/dashboard/HeadlineStats';
import PrevalenceStats from '@/components/dashboard/PrevalenceStats';
import DashboardGate from '@/components/dashboard/DashboardGate';
import FilterPanel from '@/components/dashboard/FilterPanel';
import DetailedCompTable from '@/components/dashboard/DetailedCompTable';
import CompByRoleChart from '@/components/dashboard/CompByRoleChart';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { ROLE_SLUGS } from '@/lib/constants/roles';
import { getRoleName } from '@/lib/utils/formatting';
import type { BenchmarkResult, RoleBenchmark } from '@/types/benchmarks';

export const metadata: Metadata = {
  title: 'Compensation Benchmarks',
  description:
    'Free healthcare executive compensation benchmarks. See median salaries, incentive targets, and benefit prevalence for hospital and health system leaders.',
};

async function getBenchmarks(filters?: Record<string, string>): Promise<BenchmarkResult | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${baseUrl}/api/benchmarks?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getSubmissionCount(): Promise<number> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/submission-count`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.count || 0;
  } catch {
    return 0;
  }
}

async function getRoleBenchmarks(): Promise<RoleBenchmark[]> {
  const roles = Object.entries(ROLE_SLUGS);
  const results: RoleBenchmark[] = [];

  for (const [slug, title] of roles) {
    const data = await getBenchmarks({ title });
    results.push({
      role: slug,
      roleLabel: getRoleName(slug),
      baseSalary: data?.sufficient_data ? (data.base_salary ?? null) : null,
      totalCash: data?.sufficient_data ? (data.total_cash ?? null) : null,
      count: data?.submission_count || 0,
    });
  }

  return results;
}

async function getUser() {
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [overallData, submissionCount, roleBenchmarks, user] = await Promise.all([
    getBenchmarks(Object.keys(params).length > 0 ? params : undefined),
    getSubmissionCount(),
    getRoleBenchmarks(),
    getUser(),
  ]);

  const isAuthenticated = !!user;
  const hasFilters = Object.keys(params).length > 0;

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              Compensation Benchmarks
            </h1>
            <p className="text-white/50 max-w-2xl">
              Aggregated compensation data from real healthcare executives across the
              United States. All statistics require a minimum of 5 submissions.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-xs text-white/30">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <span className="text-xs text-white/30">|</span>
              <span className="text-xs text-white/30">
                Based on {submissionCount} submissions
              </span>
            </div>
          </div>

          {/* Self-reported data disclaimer */}
          <div className="bg-navy-900/30 border border-white/5 rounded-lg px-4 py-3 mb-8 flex items-start gap-3">
            <svg className="w-4 h-4 text-white/30 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-white/30 leading-relaxed">
              All data is self-reported by healthcare executives and is not independently verified.
              Benchmarks are for informational purposes only and should not be used as the sole basis
              for any compensation decision. Consult qualified compensation consultants, legal counsel,
              and financial advisors alongside multiple data sources.
            </p>
          </div>

          {/* Ungated: Headline stats */}
          <HeadlineStats data={overallData} submissionCount={submissionCount} />

          {/* Ungated: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <CompByRoleChart
              data={roleBenchmarks}
              metric="baseSalary"
              title="Base Salary by Role"
            />
            <CompByRoleChart
              data={roleBenchmarks}
              metric="totalCash"
              title="Total Cash by Role"
            />
          </div>

          {/* Ungated: Prevalence */}
          <div className="mt-8">
            <PrevalenceStats data={overallData} />
          </div>

          {/* Role quick links */}
          <div className="mt-8 bg-navy-900/50 border border-white/10 rounded-xl p-6">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Explore by Role
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(ROLE_SLUGS).map(([slug]) => (
                <Link
                  key={slug}
                  href={`/dashboard/${slug}`}
                  className="px-4 py-2 rounded-lg bg-navy-800 border border-white/10 text-sm text-white/70 hover:text-gold-500 hover:border-gold-500/30 transition-colors"
                >
                  {getRoleName(slug)}
                </Link>
              ))}
            </div>
          </div>

          {/* Gated section */}
          <div className="mt-12">
            {isAuthenticated ? (
              <div className="space-y-8">
                <Suspense fallback={<Skeleton className="h-40" />}>
                  <FilterPanel />
                </Suspense>

                {hasFilters && overallData && (
                  <DetailedCompTable data={overallData} />
                )}

                {!hasFilters && (
                  <p className="text-white/40 text-sm text-center py-8">
                    Use the filters above to see detailed percentile breakdowns for your peer group.
                  </p>
                )}
              </div>
            ) : (
              <DashboardGate />
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm mb-4">
              Help make these benchmarks more accurate and comprehensive.
            </p>
            <Link href="/submit">
              <Button>Contribute Your Data</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
