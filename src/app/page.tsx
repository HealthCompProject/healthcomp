import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SubmissionCounter from '@/components/shared/SubmissionCounter';
import EmailCapture from '@/components/shared/EmailCapture';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthcomp.org';

export const metadata: Metadata = {
  title: 'HealthComp — The Healthcare Compensation Project',
  description:
    'The first free compensation benchmark built by and for healthcare executives at U.S. hospitals and health systems. Anonymous, peer-driven, and independent.',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'HealthComp — The Healthcare Compensation Project',
    description:
      'Free, anonymous compensation benchmarking for senior healthcare executives at U.S. hospitals and health systems.',
    url: BASE_URL,
    type: 'website',
    locale: 'en_US',
    siteName: 'The Healthcare Compensation Project',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthComp — The Healthcare Compensation Project',
    description:
      'Free, anonymous compensation benchmarking for healthcare executives.',
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd
        url={BASE_URL}
        name="The Healthcare Compensation Project"
        description="Free healthcare executive compensation benchmarks built by and for senior leaders at U.S. hospitals and health systems."
      />
      <WebSiteJsonLd
        url={BASE_URL}
        name="The Healthcare Compensation Project"
        description="The first free compensation benchmark built by and for healthcare executives. Anonymous, aggregated, and independent."
      />
      <Header />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-16">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,119,6,0.08),transparent_50%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Healthcare Executive Compensation,{' '}
            <span className="text-gold-500">Benchmarked by Peers</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            The first free compensation benchmark built by and for senior leaders
            at U.S. hospitals and health systems. Anonymous. Aggregated. Independent.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <Button size="lg">Contribute Your Data</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                Explore Benchmarks
              </Button>
            </Link>
          </div>

          <SubmissionCounter className="mt-8 justify-center" />
        </div>
      </section>

      {/* Why This Exists */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold text-white mb-6">
                Why This Exists
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Healthcare executive compensation data has been locked behind
                  $5,000+ paywalls from traditional survey firms. The free
                  alternatives? Glassdoor and LinkedIn, where the data is
                  self-reported by anyone, rarely verified, and wildly inaccurate
                  for senior roles.
                </p>
                <p>
                  HealthComp is different. It&apos;s built exclusively for the C-suite
                  and senior leadership at hospitals and health systems. Every data
                  point is structured, validated, and only shown in aggregate with
                  strict privacy thresholds.
                </p>
                <p>
                  The result: compensation benchmarks you can actually trust, available
                  to every healthcare executive for free.
                </p>
              </div>
            </div>

            <div className="bg-navy-900/50 border border-white/10 rounded-2xl p-8 space-y-6">
              <h3 className="text-xs font-bold text-white/40 tracking-wider uppercase">
                The Status Quo
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="font-serif text-3xl font-bold text-gold-500">
                    $5,000 – $15,000+
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    Annual cost of a single commercial compensation survey
                  </p>
                </div>
                <div className="border-t border-white/5 pt-5">
                  <p className="font-serif text-3xl font-bold text-gold-500">
                    12 – 18 months
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    Typical lag between data collection and publication
                  </p>
                </div>
                <div className="border-t border-white/5 pt-5">
                  <p className="font-serif text-3xl font-bold text-white">
                    $0
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    What HealthComp costs — forever
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-white/5 bg-navy-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Three minutes of your time creates lasting value for the entire
              healthcare executive community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Submit Anonymously',
                description:
                  'Complete our structured compensation form. No names, emails, or employer names are collected.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'We Aggregate',
                description:
                  'Your data joins a pool of peer submissions. Statistics are only shown when 5+ responses exist for any segment.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Access Benchmarks',
                description:
                  'View free headline benchmarks immediately. Create a free account for detailed filtering and percentile breakdowns.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <Card key={item.step} accent className="text-center">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-500">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gold-500/60 tracking-wider">
                  STEP {item.step}
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-4">
              Your Privacy, Protected
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              We built this platform with the same rigor you&apos;d expect from a
              financial institution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Completely Anonymous',
                description:
                  'No names, no email required to submit, no employer identification. We collect no personally identifying information.',
              },
              {
                title: '5-Submission Minimum',
                description:
                  'No statistic is ever displayed unless it represents 5 or more submissions. This prevents identification.',
              },
              {
                title: 'Aggregated Only',
                description:
                  'We only show percentiles (25th, 50th, 75th) and prevalence rates. Individual data points are never exposed.',
              },
              {
                title: 'No Single-Source Dominance',
                description:
                  'No single submission can represent more than 25% of any displayed statistic. This prevents gaming.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-navy-900/30 border border-white/5 rounded-xl p-6"
              >
                <div className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Creator */}
      <section className="py-24 border-t border-white/5 bg-navy-900/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-6">
            Built by Someone Who Understands
          </h2>
          <p className="text-white/60 leading-relaxed mb-4">
            This project was created by a wealth advisor who works exclusively with
            healthcare executives. After years of watching clients struggle to find
            reliable compensation data — or pay thousands for outdated surveys — the
            need for a free, peer-driven benchmark became clear.
          </p>
          <p className="text-white/60 leading-relaxed">
            This platform is independently operated. It&apos;s not tied to a recruiting
            firm, consulting group, or employer organization. The only agenda is
            giving healthcare leaders the data transparency they deserve.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-white/20 leading-relaxed text-center">
            All benchmarks are derived from self-reported data and are not independently
            verified. All statistics are for informational and general benchmarking purposes only
            and do not constitute financial, legal, tax, or employment advice. Compensation decisions
            should be made in consultation with qualified professional advisors.
          </p>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Quarterly Compensation Insights
          </h2>
          <p className="text-white/50 mb-8">
            Get trend analysis, new benchmark data, and industry insights
            delivered to your inbox every quarter.
          </p>
          <EmailCapture
            source="footer"
            className="max-w-sm mx-auto"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
