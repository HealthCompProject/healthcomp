import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using The Healthcare Compensation Project.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Terms of Use
          </h1>
          <p className="text-white/40 text-sm mb-12">
            Last updated: March 2026
          </p>

          <div className="prose-custom space-y-10">
            <Section title="Acceptance of Terms">
              <p>
                By accessing or using HealthComp (&ldquo;the Platform&rdquo;),
                you agree to these Terms of Use. If you do not agree, please do
                not use the Platform.
              </p>
            </Section>

            <Section title="What HealthComp Is">
              <p>
                HealthComp is a free, independent, open-source compensation
                benchmarking platform for senior healthcare executives at U.S.
                hospitals and health systems. It aggregates self-reported
                compensation data and presents it in anonymous, statistical
                form.
              </p>
            </Section>

            <Section title="Self-Reported Data">
              <p>
                All compensation data on this platform is self-reported by
                participants. HealthComp does not independently verify any
                submissions. While we implement data quality measures (invite
                codes, input validation, duplicate detection, and aggregation
                thresholds), we cannot guarantee the accuracy of any individual
                submission or the resulting benchmarks.
              </p>
              <p>
                You should treat the data presented here as one input among many
                when evaluating compensation — not as a definitive source.
              </p>
            </Section>

            <Section title="Not Financial, Legal, or Employment Advice">
              <p>
                Nothing on this platform constitutes financial advice, legal
                advice, tax advice, or employment advice. The benchmarks and
                statistics presented are for informational and general
                benchmarking purposes only.
              </p>
              <p>
                Compensation decisions should be made in consultation with
                qualified advisors — including your legal counsel, tax advisor,
                and/or compensation consultant — who understand your specific
                situation.
              </p>
            </Section>

            <Section title="Your Submissions">
              <p>
                By submitting compensation data, you represent that:
              </p>
              <ul>
                <li>
                  The data you provide reflects your genuine compensation
                  information to the best of your knowledge.
                </li>
                <li>
                  You are authorized to share this information (i.e., it does
                  not violate any confidentiality agreement with your employer).
                </li>
                <li>
                  You understand that your submission is anonymous and cannot be
                  retrieved, modified, or deleted after submission.
                </li>
              </ul>
              <p>
                You grant HealthComp a perpetual, irrevocable license to use
                your anonymized submission data as part of its aggregated
                benchmarks.
              </p>
            </Section>

            <Section title="Invite Codes">
              <p>
                Access to the submission form requires a valid invite code.
                Invite codes are single-use and intended for healthcare
                executives at U.S. hospitals and health systems. Sharing invite
                codes with individuals outside this population, or using the
                Platform to submit intentionally inaccurate data, violates these
                Terms.
              </p>
            </Section>

            <Section title="Accounts">
              <p>
                Creating a free account (via email magic link) is optional and
                provides access to detailed benchmark filtering. You are
                responsible for maintaining the security of your account. We may
                suspend or terminate accounts that we believe are being used to
                abuse the Platform.
              </p>
            </Section>

            <Section title="Prohibited Uses">
              <p>You agree not to:</p>
              <ul>
                <li>
                  Submit intentionally false or misleading compensation data.
                </li>
                <li>
                  Attempt to re-identify individuals from the aggregated data.
                </li>
                <li>
                  Scrape, crawl, or programmatically extract data from the
                  Platform.
                </li>
                <li>
                  Use the Platform for any commercial purpose without written
                  permission (e.g., reselling data, building competing
                  products).
                </li>
                <li>
                  Circumvent invite code requirements or other data quality
                  measures.
                </li>
              </ul>
            </Section>

            <Section title="Open Source Code">
              <p>
                The HealthComp source code is open source under the{' '}
                <a
                  href="https://www.gnu.org/licenses/agpl-3.0.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GNU Affero General Public License v3 (AGPL-3.0)
                </a>
                . You are free to view, fork, and modify the code under the
                terms of that license.
              </p>
            </Section>

            <Section title="Open Data">
              <p>
                The aggregated compensation benchmarks published by HealthComp
                — including percentile statistics, prevalence rates, trend
                data, and downloadable data exports — are licensed under the{' '}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Creative Commons Attribution 4.0 International License (CC BY 4.0)
                </a>
                .
              </p>
              <p>
                You are free to share, redistribute, remix, and build upon the
                aggregated data for any purpose, including commercial use,
                provided you give appropriate credit
                (e.g., &ldquo;Source: HealthComp, healthcomp.org&rdquo;).
              </p>
              <p>
                Updated data exports are published quarterly on our{' '}
                <a href="/data">Open Data</a> page.
              </p>
            </Section>

            <Section title="Raw Submissions Are Private">
              <p>
                Individual, raw survey submissions are <strong>not</strong>{' '}
                covered by either the open source or open data licenses. Raw
                submissions are stored securely and are never published, shared,
                or made available in any form. They are used solely to compute
                the aggregated benchmarks.
              </p>
              <p>
                This distinction exists to protect respondent anonymity. Only
                aggregated statistics that meet our minimum threshold
                requirements (5+ submissions, no single source greater than 25%)
                are ever published.
              </p>
            </Section>

            <Section title="Trademarks">
              <p>
                The HealthComp name and logo are trademarks of HealthComp. You
                may cite HealthComp data in presentations, reports, and articles
                with proper attribution.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                HealthComp is provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; without warranties of any kind, express or
                implied. We do not warrant that the data is accurate, complete,
                or current.
              </p>
              <p>
                To the maximum extent permitted by law, HealthComp and its
                operators shall not be liable for any direct, indirect,
                incidental, consequential, or special damages arising from your
                use of the Platform or reliance on its data.
              </p>
            </Section>

            <Section title="Changes to These Terms">
              <p>
                We may update these Terms from time to time. Continued use of
                the Platform after changes constitutes acceptance of the revised
                Terms. Material changes will be noted by updating the &ldquo;last
                updated&rdquo; date.
              </p>
            </Section>

            <Section title="Governing Law">
              <p>
                These Terms are governed by the laws of the United States and
                the state in which HealthComp operates, without regard to
                conflict of law provisions.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions about these terms? Reach out at{' '}
                <a
                  href="mailto:info@healthcomp.org"
                  className="text-gold-500 hover:text-gold-400 transition-colors"
                >
                  info@healthcomp.org
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl font-bold text-white mb-4">{title}</h2>
      <div className="text-white/60 text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-white/80 [&_a]:text-gold-500 [&_a:hover]:text-gold-400">
        {children}
      </div>
    </section>
  );
}
