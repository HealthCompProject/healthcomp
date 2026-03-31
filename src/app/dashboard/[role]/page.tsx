import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeadlineStats from '@/components/dashboard/HeadlineStats';
import DetailedCompTable from '@/components/dashboard/DetailedCompTable';
import PrevalenceStats from '@/components/dashboard/PrevalenceStats';
import Button from '@/components/ui/Button';
import { ROLE_SLUGS } from '@/lib/constants/roles';
import { getRoleName, getRoleFullName } from '@/lib/utils/formatting';
import type { BenchmarkResult } from '@/types/benchmarks';

const validRoles = Object.keys(ROLE_SLUGS);

export function generateStaticParams() {
  return validRoles.map((role) => ({ role }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const fullName = getRoleFullName(role);
  const shortName = getRoleName(role);

  return {
    title: `${shortName} Compensation Benchmarks`,
    description: `Free healthcare ${fullName} compensation benchmarks. See median salary, incentive targets, and total cash compensation for hospital and health system ${shortName}s.`,
  };
}

async function getRoleBenchmarks(role: string): Promise<BenchmarkResult | null> {
  try {
    const title = ROLE_SLUGS[role];
    if (!title) return null;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const params = new URLSearchParams({ title });
    const res = await fetch(`${baseUrl}/api/benchmarks?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!validRoles.includes(role)) {
    notFound();
  }

  const data = await getRoleBenchmarks(role);
  const fullName = getRoleFullName(role);
  const shortName = getRoleName(role);

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-white/40 hover:text-gold-500 transition-colors"
            >
              Benchmarks
            </Link>
            <span className="text-white/20 mx-2">/</span>
            <span className="text-sm text-white/70">{shortName}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              {fullName} Compensation
            </h1>
            <p className="text-white/50 max-w-2xl">
              Compensation benchmarks for {fullName}s at U.S. hospitals and health systems.
              {data?.sufficient_data &&
                ` Based on ${data.submission_count} submissions.`}
            </p>
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

          {data?.sufficient_data ? (
            <div className="space-y-8">
              <HeadlineStats data={data} submissionCount={data.submission_count} />
              <DetailedCompTable data={data} />
              <PrevalenceStats data={data} />
            </div>
          ) : (
            <div className="bg-navy-900/50 border border-white/10 rounded-xl p-12 text-center">
              <h2 className="font-serif text-xl font-bold text-white mb-3">
                We need more {shortName} data
              </h2>
              <p className="text-white/50 max-w-md mx-auto mb-6">
                We currently have {data?.submission_count || 0} {shortName} submissions.
                We need at least 5 to display benchmarks.
              </p>
              <Link href="/submit">
                <Button>Be the First to Contribute</Button>
              </Link>
            </div>
          )}

          {/* Other roles */}
          <div className="mt-12 bg-navy-900/50 border border-white/10 rounded-xl p-6">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Other Roles
            </h3>
            <div className="flex flex-wrap gap-3">
              {validRoles
                .filter((r) => r !== role)
                .map((r) => (
                  <Link
                    key={r}
                    href={`/dashboard/${r}`}
                    className="px-4 py-2 rounded-lg bg-navy-800 border border-white/10 text-sm text-white/70 hover:text-gold-500 hover:border-gold-500/30 transition-colors"
                  >
                    {getRoleName(r)}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
