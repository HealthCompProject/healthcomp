import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { DatasetJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthcomp.org';

export const metadata: Metadata = {
  title: 'Open Data — Healthcare Executive Compensation',
  description:
    'Download free healthcare executive compensation benchmarks. Aggregated data licensed under CC BY 4.0 for unrestricted use with attribution.',
  alternates: {
    canonical: `${BASE_URL}/data`,
  },
};

export default function DataPage() {
  return (
    <>
      <DatasetJsonLd
        name="Healthcare Compensation Project — Executive Compensation Benchmarks"
        description="Aggregated compensation benchmarks for senior healthcare executives at U.S. hospitals and health systems, including base salary, incentive targets, total cash compensation, and benefits prevalence by role, organization size, and region."
        url={`${BASE_URL}/data`}
        license="https://creativecommons.org/licenses/by/4.0/"
        creator="The Healthcare Compensation Project"
        dateModified={new Date().toISOString().split('T')[0]}
      />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Open Data
              </h1>
              <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-bold uppercase tracking-wider">
                CC BY 4.0
              </span>
            </div>
            <p className="text-white/50 max-w-2xl leading-relaxed">
              All aggregated benchmarks are freely available under
              the{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-gold-400 transition-colors"
              >
                Creative Commons Attribution 4.0
              </a>{' '}
              license. Use the data for research, reporting, presentations, or
              any other purpose — just include attribution.
            </p>
          </div>

          {/* Data disclaimer */}
          <div className="bg-navy-900/30 border border-white/5 rounded-lg px-4 py-3 mb-8 flex items-start gap-3">
            <svg className="w-4 h-4 text-white/30 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-xs text-white/30 leading-relaxed">
              This data is self-reported and not independently verified. It is provided for
              informational and benchmarking purposes only and does not constitute financial,
              legal, or employment advice. Users of this data are responsible for their own
              analysis and conclusions.
            </p>
          </div>

          {/* Download cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card accent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    JSON Format
                  </h3>
                  <p className="text-white/40 text-sm mb-4">
                    Structured data ideal for programmatic use, APIs, and data
                    analysis tools. Includes full metadata and licensing info.
                  </p>
                  <a href="/api/data/export?format=json">
                    <Button size="sm">Download JSON</Button>
                  </a>
                </div>
              </div>
            </Card>

            <Card accent>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    CSV Format
                  </h3>
                  <p className="text-white/40 text-sm mb-4">
                    Flat table format for spreadsheets, Excel, Google Sheets,
                    and statistical software (R, Stata, etc.).
                  </p>
                  <a href="/api/data/export?format=csv">
                    <Button size="sm">Download CSV</Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* What's included */}
          <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6 sm:p-8 mb-12">
            <h2 className="font-serif text-xl font-bold text-white mb-6">
              What&apos;s Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Compensation Percentiles',
                  items: [
                    'Base salary (P25, P50, P75)',
                    'Total cash compensation (P25, P50, P75)',
                    'Annual incentive target % (P25, P50, P75)',
                  ],
                },
                {
                  title: 'Benefit Prevalence',
                  items: [
                    '% with deferred compensation',
                    '% with long-term incentive plans',
                    '% with 457(f) plans',
                    '% with supplemental retirement (SERP)',
                  ],
                },
                {
                  title: 'Segments',
                  items: [
                    'Overall (all submissions)',
                    'By executive role (CEO, CFO, COO, etc.)',
                    'By organization size (net patient revenue)',
                    'By U.S. region',
                  ],
                },
                {
                  title: 'Metadata',
                  items: [
                    'Submission count per segment',
                    'Data generation timestamp',
                    'License and attribution info',
                    'Methodology notes',
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-white/50 flex items-start gap-2"
                      >
                        <span className="text-gold-500 mt-1.5 shrink-0">
                          &bull;
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Attribution */}
          <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-6 sm:p-8 mb-12">
            <h2 className="font-serif text-xl font-bold text-gold-500 mb-4">
              How to Cite
            </h2>
            <p className="text-white/50 text-sm mb-4">
              When using HealthComp data in publications, presentations, or
              products, please include the following attribution:
            </p>
            <div className="bg-navy-900 rounded-lg p-4 font-mono text-sm text-white/70">
              Source: HealthComp (healthcomp.org), {new Date().getFullYear()}.
              Licensed under CC BY 4.0.
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-navy-900/50 border border-white/10 rounded-xl p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-white mb-4">
              Methodology & Limitations
            </h2>
            <div className="text-white/50 text-sm leading-relaxed space-y-3">
              <p>
                All data is self-reported by healthcare executives through our
                structured survey. Submissions require an invite code and are
                subject to input validation and duplicate detection.
              </p>
              <p>
                Aggregated statistics are only computed when at least 5
                submissions exist for a given segment, and no single submission
                may represent more than 25% of any displayed statistic.
              </p>
              <p>
                The Healthcare Compensation Project does not independently verify individual submissions.
                The data should be treated as a directional benchmark, not a
                definitive market study. For compensation decisions, consult
                qualified advisors alongside multiple data sources.
              </p>
              <p>
                Data exports are generated in real time from the current
                submission pool. Quarterly snapshots with trend analysis are
                published in our newsletter.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
