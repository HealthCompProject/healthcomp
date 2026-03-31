import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthcomp.org';

export const metadata: Metadata = {
  title: 'About',
  description:
    'HealthComp is a free, open-source compensation benchmarking platform for senior healthcare executives at U.S. hospitals and health systems.',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

const faqItems = [
  {
    question: 'How is my anonymity protected?',
    answer:
      'HealthComp collects no names, no employer names, and no email is required to submit. IP addresses are hashed using irreversible one-way SHA-256 hashing \u2014 the original IP is never stored. Browser fingerprints are similarly hashed. Data is only displayed in aggregate when at least 5 submissions exist for a given statistic, and no single submission can represent more than 25% of any displayed figure. The database enforces row-level security that blocks all direct reads of individual submissions \u2014 data can only be accessed through aggregation functions.',
  },
  {
    question: 'Who can see my individual submission?',
    answer:
      'Nobody. The database is configured so that no one \u2014 not even the site administrator \u2014 can query individual submissions directly. All data access goes through PostgreSQL functions that enforce aggregation rules and minimum thresholds. Your individual data points are never exposed.',
  },
  {
    question: 'How do invite codes work?',
    answer:
      'HealthComp uses an invite code system to maintain data quality. Each submitter receives 3 new invite codes after completing the survey, which they can share with peers. Codes are single-use. This creates a trust chain where each participant vouches for the next, similar to how professional networks naturally operate.',
  },
  {
    question: 'How is this funded?',
    answer:
      'HealthComp has no sponsors, no advertising, no revenue, and no investors. It is built and maintained independently by John Montgomery. Infrastructure costs (hosting, database) are minimal and paid out of pocket. There is no business model. The project exists because the data should be free and accessible.',
  },
  {
    question: 'Is this affiliated with any hospital system, consulting firm, or trade association?',
    answer:
      'No. HealthComp is fully independent. It is not affiliated with any healthcare organization, compensation consulting firm, trade association, or industry group. The open-source licensing ensures that no single entity controls the project.',
  },
  {
    question: 'Can I use the data?',
    answer:
      'Yes. All aggregated data is published under Creative Commons Attribution 4.0 (CC BY 4.0). You can share, redistribute, and remix it for any purpose, including commercial use. The only requirement is attribution: \u201cSource: HealthComp, healthcomp.org.\u201d Raw individual submissions are never published or made available.',
  },
  {
    question: 'Is the data verified?',
    answer:
      'Data is self-reported and not independently verified. HealthComp uses validation rules, range checks, and the invite code trust chain to maintain data quality, but all results should be treated as benchmarks from self-reported data, not audited figures. The platform is not a substitute for professional compensation analysis.',
  },
  {
    question: 'What technology does HealthComp use?',
    answer:
      'Next.js, Supabase (PostgreSQL), and Tailwind CSS. The source code is available on GitHub under AGPL-3.0.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* What HealthComp Is */}
          <section className="mb-16">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
              About HealthComp
            </h1>
            <p className="text-white/60 leading-relaxed">
              HealthComp is a free, open-source compensation benchmarking platform for
              senior healthcare executives at U.S. hospitals and health systems. All
              compensation data is self-reported, anonymous, and published in aggregate
              under a{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-gold-400 transition-colors"
              >
                Creative Commons Attribution 4.0
              </a>{' '}
              license. The source code is licensed under{' '}
              <a
                href="https://www.gnu.org/licenses/agpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-gold-400 transition-colors"
              >
                AGPL-3.0
              </a>
              .
            </p>
          </section>

          {/* Why It Exists */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">
              Why It Exists
            </h2>
            <div className="space-y-5 text-white/60 leading-relaxed">
              <p>
                Commercial compensation surveys cost thousands of dollars a year and
                are only accessible to organizations that pay for them. The individual
                executives whose data those surveys are built on &mdash; the people
                the numbers are actually about &mdash; often have no reliable benchmark
                when negotiating their own packages. Compensation data about you should
                be accessible to you. That&apos;s a belief about transparency and
                fairness, not a business model.
              </p>
              <p>
                Privacy is foundational, not a feature. HealthComp collects no names,
                no employer names, and requires no email to submit. IP addresses are
                hashed with irreversible one-way hashing. Data is only ever displayed
                in aggregate with strict minimum thresholds. The architecture is
                anonymous by design &mdash; not because of a privacy policy, but
                because the system literally cannot identify you.
              </p>
              <p>
                Open source matters. The code is public so anyone can verify how data
                is collected, stored, and aggregated. The aggregated data is CC BY 4.0
                so anyone can use it &mdash; researchers, boards, consultants,
                executives, journalists. If HealthComp disappears tomorrow, the data
                and the code survive. The platform is infrastructure, not a product.
              </p>
            </div>
          </section>

          {/* Who Built It */}
          <section className="mb-20">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">
              Who Built It
            </h2>
            <p className="text-white/60 leading-relaxed">
              HealthComp is built and maintained by John Montgomery, an independent
              financial advisor and founder of{' '}
              <a
                href="https://montgo.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-500 hover:text-gold-400 transition-colors"
              >
                Montgomery Wealth Advisors
              </a>
              , a registered investment advisory firm specializing in healthcare
              executives.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="text-white font-bold mb-2">{item.question}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
